import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = (req, res) => {
    const userId = req.params.userId;
    const status = dao.deleteUser(userId);
    res.json(status);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => {
    const { role, name } = req.query;

    if (role) {
      const users = dao.findUsersByRole(role);
      return res.json(users);
    }

    if (name) {
      const users = dao.findUsersByPartialName(name);
      return res.json(users);
    }

    // return all users if no query parameters are provided
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const userId = req.params.userId;
    const user = dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;

    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  {/* extracts properties username and password from the request's body and passess them 
    to the findUserByCredentials function implemented by the DAO. 
    The resulting user is stored in the server variable currentUser to remember the logged in user. 
    The user is then sent to the client in the response.*/}
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);

    if (user) {
      res.status(400).json(
        { message: "Username already in use!" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);

    console.log("Successfully signed up user:", currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);

    console.log("Found current user: ", currentUser);

    if (currentUser) {
      req.session["currentUser"] = currentUser;
      console.log("Successfully sign in user:", req.session["currentUser"]);
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Please try again later." });
      return;
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const findCoursesForUnenrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForUnenrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    console.log("Request received in createCourse route:", req.body);

    const newCourse = courseDao.createCourse(req.body);

    const currentUser = req.session["currentUser"];
    console.log("Found current User: ", currentUser);

    console.log("Calling enrollUserInCourse in createCourse...");

    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);

    res.json(newCourse);
  };

  const enrollCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const { course } = req.body;
    console.log("Calling enrollUserInCourse in enrollCourse...");

    enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    res.json(course);
  }

  const dropCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const course = req.body;
    enrollmentsDao.unenrollUserInCourse(currentUser._id, course._id);
    console.log("Dropped course: ", course._id);
    res.json(course);
  }


  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/:userId/courses/enroll", findCoursesForUnenrolledUser);
  app.post("/api/users/:userId/courses/enroll", enrollCourse);
  app.delete("/api/users/:userId/courses", dropCourse);
  app.post("/api/users/current/courses", createCourse);
}
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {

  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const status = await dao.deleteUser(userId);
    res.json(status);
    res.sendStatus(200);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      return res.json(users);
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      return res.json(users);
    }
    // return all users if no query parameters are provided
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const user = await dao.findUserById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;

    await dao.updateUser(userId, userUpdates);

    const currentUser = req.session["currentUser"];

    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };

  {/* extracts properties username and password from the request's body and passess them 
    to the findUserByCredentials function implemented by the DAO. 
    The resulting user is stored in the server variable currentUser to remember the logged in user. 
    The user is then sent to the client in the response.*/}
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);

    if (user) {
      res.status(400).json(
        { message: "Username already in use!" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);

    console.log("Successfully signed up user:", currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);

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

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const findCoursesForUnenrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await courseDao.findCoursesForUnenrolledUser(userId);
    res.json(courses);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
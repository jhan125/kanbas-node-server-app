import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as userDao from "../Users/dao.js";
import * as moduleDao from "../Modules/dao.js";
import * as assignmentDao from "../Assignments/dao.js";

export default function CourseRoutes(app) {
  const createCourse = async (req, res) => {
    console.log("Creating a new course in DB...");
    const course = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (!currentUser || !currentUser._id) {
      res.status(401).send("Failed to find currentUser in session");
      return;
    }
    console.log("Fetching a user by user ID(%s)...", currentUser._id);
    const user = await userDao.findUserById(currentUser._id);
    if (!user) {
      res
        .status(404)
        .send(
          "Failed to find the current user by ID(%s) in the database",
          currentUser._id
        );
      return;
    }
    console.log(
      "Enrolling user[%s] role[%s] into course (%s)...",
      user._id,
      user.role,
      course._id
    );
    enrollmentsDao.enrollUserInCourse(user._id, course._id);
    res.json(course);
  };

  const findAllCourses = async (_req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const getCourseByID = async (req, res) => {
    console.log("Fetching course by ID: %s...", req.params.cid);
    const course = await dao.findCourseById(req.params.cid);
    res.json(course);
  };

  const updateCourse = async (req, res) => {
    const courseUpdates = req.body;
    const status = await dao.updateCourse(req.params.cid, courseUpdates);
    res.json(status);
  };

  const deleteCourse = async (req, res) => {
    const status = await dao.deleteCourse(req.params.cid);
    res.json(status);
  };

  const createCourseModules = async (req, res) => {
    const courseID = req.params.cid;
    const module = {
      ...req.body,
      course: courseID,
    };
    console.log("Creating a new module in DB with course(id: %s)...", courseID);
    const newModule = await moduleDao.createModule(module);
    res.send(newModule);
  };

  const findModuleByCourse = async (req, res) => {
    const courseID = req.params.cid;
    console.log("Searching the modules for course(%s)...", courseID);
    const modules = await moduleDao.findModuleByCourseID(courseID);
    console.log("Found %d modules for course(%s)...", modules.length, courseID);
    res.json(modules);
  };

  const findEnrolledUsersInCourse = async (req, res) => {
    const courseID = req.params.cid;
    console.log("Searching the enrolled users for course(%s)...", courseID);
    const users = await enrollmentsDao.findAllPeopleInCourse(courseID);
    res.json(users);
  };

  const createNewAssignment = async (req, res) => {
    const courseID = req.params.cid;
    const assignment = {
      ...req.body,
      course: courseID,
    };
    console.log(
      "Creating a new assignment in DB with course(id: %s)...",
      courseID
    );
    const newAssignment = await assignmentDao.createAssignment(assignment);
    res.send(newAssignment);
  };

  const findAssignmentsByCourse = async (req, res) => {
    const courseID = req.params.cid;
    console.log("Searching the assignments for course(%s)...", courseID);
    const assignments = await assignmentDao.findAssignmentsForCourse(courseID);
    res.json(assignments);
  };

  // CRUD of courses
  app.post("/api/courses", createCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:cid", getCourseByID);
  app.put("/api/courses/:cid", updateCourse);
  app.delete("/api/courses/:cid", deleteCourse);
  // Modules
  app.post("/api/courses/:cid/modules", createCourseModules);
  app.get("/api/courses/:cid/modules", findModuleByCourse);

  //Enrolled Users
  app.get("/api/courses/:cid/users", findEnrolledUsersInCourse);

  // Assignments
  app.post("/api/courses/:cid/assignments", createNewAssignment);
  app.get("/api/courses/:cid/assignments", findAssignmentsByCourse);
}

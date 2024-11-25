import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const createCourse = async (req, res) => {
    console.log("Request received in createCourse route:", req.body);

    const course = await dao.createCourse(req.body);
    
    console.log("Calling enrollUserInCourse in createCourse...");
    enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);

    res.json(course);
  }

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  }

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  }

  const deleteCourse = async (req, res) => {
    const status = await dao.deleteCourse(req.params.id);
    res.json(status);
  }


  app.post("/api/users/:userId/courses", createCourse);
  app.get("/api/users/:userId/courses", findAllCourses);
  app.put("/api/users/:userId/courses/:id", updateCourse);
  app.delete("/api/users/:userId/courses/:id", deleteCourse);
}
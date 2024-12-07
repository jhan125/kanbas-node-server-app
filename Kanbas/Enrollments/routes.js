import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {

  // const findCoursesForEnrolledUser = async (req, res) => {
  //   let { userId } = req.params;
  //   if (userId === "current") {
  //     const currentUser = req.session["currentUser"];
  //     if (!currentUser) return res.sendStatus(401);
  //     userId = currentUser._id;
  //   }
  //   const courses = await enrollmentsDao.findCoursesForEnrolledUser(userId);
  //   res.json(courses);
  // };

  // const findCoursesForUnenrolledUser = async (req, res) => {
  //   let { userId } = req.params;
  //   if (userId === "current") {
  //     const currentUser = req.session["currentUser"];
  //     if (!currentUser) return res.sendStatus(401);
  //     userId = currentUser._id;
  //   }
  //   const courses = await enrollmentsDao.findCoursesForUnenrolledUser(userId);
  //   res.json(courses);
  // };

  const enrollCourse = async (req, res) => {
    const { userId } = req.params;
    const { course } = req.body;
    console.log("Calling enrollUserInCourse in enrollCourse...");
    await enrollmentsDao.enrollUserInCourse(userId, course._id);
    res.json(course);
  };
  

  const dropCourse = async (req, res) => {
    const { userId } = req.params;
    const course = req.body;
    await enrollmentsDao.unenrollUserInCourse(userId, course._id);
    res.json(course);
  };

  const findAllPeopleInCourse = async (courseId) => {
    const enrollments = await enrollmentModel
      .find({ course: courseId }) // Find all enrollments for the course
      .populate("user", "name email role"); // Populate user details (adjust fields as needed)
  
    return enrollments.map((enrollment) => enrollment.user);
  };
   

  // app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  // app.get("/api/users/:userId/courses/unenrolled", findCoursesForUnenrolledUser);
  app.post("/api/users/:userId/courses/enroll", enrollCourse);
  app.delete("/api/users/:userId/courses", dropCourse);
  app.get("/api/courses/:courseId/users", findAllPeopleInCourse);
}

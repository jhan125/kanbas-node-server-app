import enrollmentModel from "./model.js";
import courseModel from "../Courses/model.js";

// Find courses the user is enrolled in
export const findCoursesForEnrolledUser = async (userId) => {
  try {
    // Query the enrollments collection for the specified userId
    const enrollments = await enrollmentModel.find({ user: userId })
      .populate("course") // Populate the course details
      .exec();
    
    return enrollments.map((enrollment) => enrollment.course);
  } catch (error) {
    console.error("Error finding courses for enrolled user:", error);
    throw new Error("Unable to retrieve courses for the user");
  }
};

// Find courses the user is NOT enrolled in
export const findCoursesForUnenrolledUser = async (userId) => {
  const enrolledCourses = await enrollmentModel
    .find({ user: userId })
    .select("course");
  const enrolledCourseIds = enrolledCourses.map((e) => e.course);
  return courseModel.find({ _id: { $nin: enrolledCourseIds } });
};

// Enroll a user in a course
export const enrollUserInCourse = async (userId, courseId) => {
  return enrollmentModel.create({ user: userId, course: courseId });
};

// Drop a course for a user
export const unenrollUserInCourse = async (userId, courseId) => {
  return enrollmentModel.deleteOne({ user: userId, course: courseId });
};

export const findAllPeopleInCourse = async (courseId) => {
  const enrollments = await enrollmentModel
    .find({ course: courseId }) // Find all enrollments for the course
    .populate("user");

  return enrollments.map((enrollment) => enrollment.user);
};

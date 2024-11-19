import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
  console.log("Enrolling user with ID", userId, "in course:", courseId);

  const { enrollments } = Database;
  if (!userId || !courseId) {
    throw new Error("Invalid user or course ID");
  }
  enrollments.push({ _id: Date.now(), user: userId, course: courseId });

  console.log("User enrolled:", enrollments);
}

export function unenrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter((enrollment) => (
    !(enrollment.user === userId && enrollment.course === courseId)
  ));
}
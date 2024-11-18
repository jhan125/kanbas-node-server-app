import Database from "../Database/index.js";

export function findAllCourses() {
  console.log("Database.courses:", Database.courses);
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
  return enrolledCourses;
}

export function findCoursesForUnenrolledUser(userId) {
  const { courses, enrollments } = Database;
  const unenrolledCourses = courses.filter((course) =>
    !enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
  return unenrolledCourses;
}

export function createCourse(course) {
  console.log("Creating course:", course);
  const newCourse = { ...course, _id: Date.now().toString() };
  Database.courses = [...Database.courses, newCourse];
  console.log("Course created:", newCourse);
  return newCourse;
}

export function deleteCourse(courseId) {
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
);}

export function updateCourse(courseId, courseUpdates) {
  const { courses } = Database;
  const course = courses.find((course) => course._id === courseId);
  Object.assign(course, courseUpdates);
  return course;
}

export function findAllPeopleInCourse(courseId) {
  const {enrollments, users} = Database;

  const enrolledUsers = users.filter((usr)=>enrollments.some((enrollment) => 
    enrollment.user === usr._id && enrollment.course === courseId));

  return enrolledUsers;
}
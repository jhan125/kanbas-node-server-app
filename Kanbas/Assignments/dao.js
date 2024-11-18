import Database from "../Database/index.js";

export function findAssignmentsForCourse(courseID) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseID);
}

export function createAssignment(assignment) {
  Database.assignments = [...Database.assignments, assignment]
  return assignment;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  Object.assign(assignment, assignmentUpdates);
  return assignment;
}
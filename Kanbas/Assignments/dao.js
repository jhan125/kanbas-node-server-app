import model from "./model.js";
import courseModel from "../Courses/model.js";

export const findAssignmentsForCourse = (courseID) => {
  return model.find({ course: courseID });
};

export const findAssignmentByID = (assignmentID) => {
  return model.findById(assignmentID);
};

export const createAssignment = (assignment) => {
  return model.create(assignment);
};

export const deleteAssignment = (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  return model.updateOne({ _id: assignmentId }, assignmentUpdates);
};

import model from "./model.js";

export const createModule = (module) => model.create(module);
export const findModuleByCourseID = (courseID) => model.find({ course: courseID });
export const updateModule = (moduleID, moduleUpdates) => model.updateOne({ _id: moduleID }, moduleUpdates);
export const deleteModule = (moduleID) => model.deleteOne({ _id: moduleID });
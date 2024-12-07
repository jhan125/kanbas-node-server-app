import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

export const createUser = (user) => {
  delete user._id
  return model.create(user);
};

export const findAllUsers = () => model.find();
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserById = (userId) => model.findById(userId);
export const findUserByCredentials = (username, password) =>  model.findOne({ username, password });
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};  
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
// Delete user and associated enrollments
export const deleteUser = async (userId) => {
  try {
    // Delete the user
    const userDeletionResult = await model.deleteOne({ _id: userId });

    // Delete associated enrollments
    const enrollmentDeletionResult = await enrollmentModel.deleteMany({ user: userId });

    console.log(`Deleted user and ${enrollmentDeletionResult.deletedCount} associated enrollments.`);
    return { userDeletionResult, enrollmentDeletionResult };
  } catch (error) {
    console.error("Error deleting user and associated enrollments:", error);
    throw error;
  }
};


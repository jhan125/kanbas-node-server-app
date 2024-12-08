import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";
import moduleModel from "../Modules/model.js";
import assignmentModel from "../Assignments/model.js";

export const createCourse = (course) => {
  delete course._id;
  console.log("Creating course: ", course.name);
  return model.create(course);
};

export const findAllCourses = () => model.find();
export const findCourseById = (courseId) => model.findById(courseId);
// export const findCourseByNumber = (number) => model.findOne({number: number});
export const updateCourse = (courseId, course) =>
  model.updateOne({ _id: courseId }, { $set: course });


// Delete course and associated enrollments, modules, assignments.
export const deleteCourse = async (courseId) => {
  try {
    // Delete the course
    const courseDeletionResult = await model.deleteOne({ _id: courseId });
    console.log("Deleted course: %s.", courseId);

    // Delete associated enrollments
    const enrollmentDeletionResult = await enrollmentModel.deleteMany({
      course: courseId,
    });
    console.log(
      "Deleted associated %d enrollments.",
      enrollmentDeletionResult.deletedCount
    );

    // Delete associated modules
    const moduleDeletionResult = await moduleModel.deleteMany({
      course: courseId,
    });
    console.log(
      "Deleted associated %d modules.",
      moduleDeletionResult.deletedCount
    );

    // Delete associated assignments
    const assignmentDeletionResult = await assignmentModel.deleteMany({
      course: courseId,
    });
    console.log(
      "Deleted associated %d assignments.",
      assignmentDeletionResult.deletedCount
    );

    return { courseDeletionResult, enrollmentDeletionResult, moduleDeletionResult };
  } catch (error) {
    console.error("Error deleting course and associated enrollments:", error);
    throw error;
  }
};

import model from "./model.js";

export const findQuizByCourse = (course) => model.find({ course: course });
export const findAllQuizzes = () => model.find();
export const findQuizById = (quizId) => model.findById(quizId);
export const findQuizzesForCourse = (course) => model.find({ course: course });
export const createQuiz = (quiz) => {
    delete quiz._id
    return model.create(quiz)
};
export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });
export const updateQuiz = (quizId, quiz) => model.updateOne({ _id: quizId}, { $set: quiz});
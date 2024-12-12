import { findQuestionsForQuiz } from "../Quizzes/dao.js";
import model from "./model.js";
import quizModel from "../Quizzes/model.js";

export async function findAnswersForQuiz(quizId) {
    return model.find({ quiz: quizId, finished: true });
}

export async function findAnswersForUser(quizId, userId) {
    return model.findOne({ quiz: quizId, user: userId });
}

// export async function createAnswer(quizId, answer) {
//     console.log("Creating answer for quizId:", quizId, "with answer:", answer);
//     const createdAnswer = await model.create({ quiz: quizId, attempt: 0, finished: false, ...answer });
//     console.log("Created answer:", createdAnswer);
//     return createdAnswer;
// }

export async function deleteAnswer(answerId) {
    return model.deleteOne({ _id: answerId });
}

export async function addAnswerToMap(quizId, userId, questionId, newAnswer) {
    console.log("Called Add Answer To Map....")
    console.log("addAnswerToMap - quizId:", quizId, "userId:", userId, "questionId:", questionId, "newAnswer:", newAnswer);

    if (!questionId || !newAnswer) {
        console.error("Invalid parameters: questionId or newAnswer is missing");
    }

    const answer = await model.findOne({ quiz: quizId, user: userId });
    console.log("Found answer for quizId:", quizId, "userId:", userId, answer);

    if (answer) {
        if (!answer.answers) {
            answer.answers = new Map(); // Initialize if not present
        }
        answer.answers.set(questionId, newAnswer);
        console.log("Updated answers Map:", answer.answers);

        const savedAnswer = await answer.save();
        console.log("Saved answer to DB:", savedAnswer);
        return savedAnswer;
    }
    // If no answer exists, create a new one with the given answer
    const createdAnswer = await model.create({
        quiz: quizId,
        user: userId,
        attempt: 1,
        answers: new Map([[questionId, newAnswer]]),
        finished: false,
    });
    console.log("Created new answer:", createdAnswer);
    return createdAnswer;
}

// when user submit the answer, call this api to score and save the answer
export async function addAttempt(quizId, userId) {
    console.log("Called Add Attempt....")
    const answer = await model.findOne({ quiz: quizId, user: userId });
    console.log("Found answer for quizId:", quizId, "userId:", userId, answer);
    if (!answer) {
        console.error("No answer found for quizId:", quizId, "and userId:", userId);
        return false;
    }
    // Increment attempt only in addAttempt
    answer.attempt++;
    console.log("After called AddAttempt(), now Attempts: " + answer.attempt);
    answer.finished = true;
    answer.score = 0;

    const questions = await findQuestionsForQuiz(quizId);
    console.log("Retrieved questions for quizId:", quizId, questions);

    questions.forEach((question) => {
        const userAnswer = answer.answers.get(question._id); // Ensure this works with a Map
        console.log("Question:", question._id, "Correct Answer:", question.correctAnswer, "User Answer:", userAnswer);

        if (question.correctAnswer === userAnswer) {
            console.log("Correct answer! Adding points:", question.points);
            answer.score += question.points;
        } else {
            console.log("Incorrect answer for question:", question._id);
        }
    });

    const savedAnswer = await answer.save();
    console.log("Final saved answer after scoring:", savedAnswer);
    return savedAnswer;
}

export async function newAttempt(quizId, userId) {
    const quiz = await quizModel.findById(quizId);
    const answer = await model.findOne({ quiz: quizId, user: userId });
    if (answer) {
        if ((quiz.multipleAttempts > answer.attempt || quiz.multipleAttempts === 0)
            && (new Date(quiz.until) > new Date() && new Date(quiz.available) < new Date() && new Date(quiz.due) > new Date())) {
            answer.answers = {};
            answer.finished = false;
            return answer.save();
        } else {
            // not allowed for new attempt
            return false;
        }
    }
    return model.create({ quiz: quizId, user: userId, attempt: 0, answers: {}, finished: false });
}

export async function updateAnswer(quizId, userId, newAnswer) {
    console.log(newAnswer);
    return model.updateOne({ quiz: quizId, user: userId }, { $set: newAnswer });
}
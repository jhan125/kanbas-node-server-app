import * as dao from "./dao.js";
import { findCourseById } from "../Courses/dao.js";

export default function QuizRoutes(app) {
    const findQuizByCourse = async (req, res) => {
        const course = await findCourseById(req.params.cid);
        console.log("Fetching quizzes for course ID:", course.id);
        const quizzes = await dao.findQuizByCourse(course.id);
        console.log("Found  all quizzes: ", quizzes);
        res.json(quizzes); 
    }
    app.get("/api/courses/:cid/quizzes", findQuizByCourse);

    const findAllQuizzes = async (req, res) => {
        const quizzes = await dao.findAllQuizzes()
        console.log("findallquizzes");
        res.json(quizzes)
    }
    app.get("/api/quizzes", findAllQuizzes);

    const findQuizById = async (req, res) => {
        try {
            const quiz = await dao.findQuizById(req.params.quizId);
            console.log("Found Quiz By Id: ", quiz.id);
            res.json(quiz);
        } catch (error) {
            console.error("Error fetching quiz by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
    app.get("/api/quizzes/:quizId", findQuizById)

    const createQuiz = async (req, res) => {
        const quiz  = req.body
        const course = await findCourseById(req.params.cid);
        console.log("Creating Quiz for course ID: ", course.id);
        quiz.course = course.id;
        const newQuiz = await dao.createQuiz(quiz)
        console.log("Created Quiz id[", newQuiz.id, "] successfully! ");
        res.json(newQuiz)
    }
    app.post("/api/courses/:cid/quizzes", createQuiz);

    const deleteQuiz = async (req, res) => {
        console.log("Deleting Quiz: ", req.params.quizId);
        const status = await dao.deleteQuiz(req.params.quizId);
        console.log("Deleted successfully!");
        res.json(status);
    };
    app.delete("/api/quizzes/:quizId", deleteQuiz);

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quiz = req.body
        console.log("Updatng Quiz: ", quizId);
        const status = await dao.updateQuiz(quizId, quiz);
        console.log("Updated successfully!");
        res.json(quiz);
    };
    app.put("/api/quizzes/:quizId", updateQuiz)
}
import * as dao from "./dao.js";
import { findCourseById } from "../Courses/dao.js";

export default function QuizRoutes(app) {
    const findQuizByCourse = async (req, res) => {
        console.log("findQuizByCourse");
        const course = await findCourseById(req.params.cid);
        const quizzes = await dao.findQuizByCourse(course._id);
        res.json(quizzes); 
    }
    app.get("/api/courses/:cid/quizzes", findQuizByCourse);

    const findAllQuizzes = async (req, res) => {
        const quizzes = await dao.findAllQuizzes()
        console.log("findallquize");
        res.json(quizzes)
    }
    app.get("/api/quizzes", findAllQuizzes);

    const findQuizById = async (req, res) => {
        try {
            console.log("findQuizById");
            const quiz = await dao.findQuizById(req.params.quizId);
            res.json(quiz);
        } catch (error) {
            console.error("Error fetching quiz by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
    app.get("/api/quizzes/:quizId", findQuizById)

    const createQuiz = async (req, res) => {
        console.log("createQuiz");
        const quiz  = req.body
        const course = await findCourseById(req.params.cid);
        quiz.course = course._id;
        const newQuiz = await dao.createQuiz(quiz)
        res.json(newQuiz)
    }
    app.post("/api/courses/:cid/quizzes", createQuiz);

    const deleteQuiz = async (req, res) => {
        console.log("deleteQuiz");
        const status = await dao.deleteQuiz(req.params.quizId);
        res.json(status);
    };
    app.delete("/api/quizzes/:quizId", deleteQuiz);

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quiz = req.body
        const status = await dao.updateQuiz(quizId, quiz);
        res.json(quiz);
    };
    app.put("/api/quizzes/:quizId", updateQuiz)
}
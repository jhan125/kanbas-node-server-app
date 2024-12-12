import * as answersDao from "./dao.js";

export default function AnswerRoutes(app) {

    // get the only answer linked by userid and quizid
    app.get("/api/quizzes/:quizId/user/:userId/answers", async (req, res) => {
        const { quizId, userId } = req.params;
        const answers = await answersDao.findAnswersForUser(quizId, userId);
        // if (!answers) {
        //     return res.status(404).send({ error: "No answers found" });
        // }
        res.status(200).send(answers);
    });

    // create a new answer for a quiz (put user id in the newAnswer object)
    app.post("/api/quizzes/:quizId/answers", async (req, res) => {
        const { quizId } = req.params;
        const newAnswer = req.body;
        const status = await answersDao.createAnswer(quizId, newAnswer);
        res.send(status);
    });

    /// set the finished status as true -> add attempt number -> give score
    app.put("/api/quizzes/:quizId/user/:userId/answers/finished", async (req, res) => {
        const { quizId, userId } = req.params;
        console.log("PUT /answers/finished - quizId:", quizId, "userId:", userId);

        const status = await answersDao.addAttempt(quizId, userId);
        console.log("PUT /answers/finished - success, result:", status);
        res.status(200).send(status);
    });

    // tested: update a already existed answer
    app.put("/api/quizzes/:quizId/user/:userId/answer", async (req, res) => {
        const { quizId, userId } = req.params;
        const { questionId, updateAnswer } = req.body;

        // Log the raw body for debugging
        console.log("Raw req.body:", req.body);
        console.log("Parsed fields - questionId:", questionId, "updateAnswer:", updateAnswer);

        const status = await answersDao.addAnswerToMap(quizId, userId, questionId, updateAnswer);
        console.log("PUT /answer - success, updated answer:", status);

        res.status(200).send(status);
    });


    // tested:  if allow a new attempt, create a new empty answer in database, return true
    // if not allowed, return false
    app.post("/api/quizzes/:quizId/user/:userId/answers", async (req, res) => {
        const { quizId, userId } = req.params;
        const status = await answersDao.newAttempt(quizId, userId);
        res.send(status);
    });

    // // get all answers from different users for a specific quiz by ID
    // app.get("/api/quizzes/:quizId/answers", async (req, res) => {
    //     const { quizId } = req.params;
    //     const answers = await answersDao.findAnswersForQuiz(quizId);
    //     res.send(answers);
    // });


    // // ignore, updateQuestion not found
    // app.get("/api/answers/:answerId", async (req, res) => {
    //     const { questionId } = req.params;
    //     const questionUpdates = req.body;
    //     const status = await answersDao.updateQuestion(questionId, questionUpdates);
    //     res.send(status);
    // });

    // // ignore
    // app.put("/api/quizzes/:quizId/user/:userId/answers/update", async (req, res) => {
    //     const { quizId, userId } = req.params;
    //     console.log(req.body);
    //     const { updateAnswer } = req.body;
    //     console.log(updateAnswer);
    //     const status = await answersDao.updateAnswer(quizId, userId, updateAnswer);
    //     res.send(status);
    // });

}
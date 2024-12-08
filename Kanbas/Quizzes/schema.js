import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: String,
    questionType: {
        type: String,
        enum: ["Multiple Choice", "True False", "Fill In the Blank"],
        default: "Multiple Choice"
    },
    question: String,
    answers: [String],
    correctAnswer: String,
    points: Number
});

const quizSchema = new mongoose.Schema({
    course: { type: String, required: true },
    title: { type: String, required: true },
    quizType:{
        type: String,
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz"
    },
    assignmentGroup: {
        type: String,
        enum: ["Quizzes", "Exams", "Assignments", "Project"],
        default: "Quizzes"
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, 
    multipleAttempts: { type: Number, default: 1 }, 
    showCorrectAnswers: Boolean,
    accessCode: { type: String, default: "None" },
    oneQuestionAtTime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },  
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    available: Date,
    due: Date,
    until: Date,  
    points: Number,
    questions: {type: [questionSchema], default: []}
},
    { collection: "quizzes"});

export default quizSchema;
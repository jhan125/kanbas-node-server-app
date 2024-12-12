import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
import session from "express-session";
import mongoose from 'mongoose';
import "dotenv/config";
import EnrollmentRoutes from './Kanbas/Enrollments/routes.js';
import QuizRoutes from "./Kanbas/Quizzes/routes.js";
import AnswerRoutes from "./Kanbas/Answers/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
mongoose.connect(CONNECTION_STRING);

const app = express()

// Configure CORS to support cookies and restrict network access 
// to come only from the React application as shown below.
app.use(cors({
  credentials: true,
  origin: process.env.NETLIFY_URL || "http://localhost:3000",
})
);

// configure sessions after configuring cors.
// use different front end URL in dev and in production
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
// in production- turn on proxy support & configure cookies for remote server
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));


app.use(express.json());


UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
QuizRoutes(app);
AnswerRoutes(app);

Hello(app)
Lab5(app);

app.listen(process.env.PORT || 4000)
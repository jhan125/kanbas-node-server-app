import express from 'express';
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/routes.js";

const app = express()

UserRoutes(app);

// Configure CORS to support cookies and restrict network access 
// to come only from the React application as shown below.
app.use(cors({
  credentials: true,
  origin: process.env.NETLIFY_URL || "http://localhost:3000",
})
);


app.use(express.json());

Lab5(app);

Hello(app)

app.listen(process.env.PORT || 4000)

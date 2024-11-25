import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "courses", required: true },
},
  { collection: "enrollments" }
);
export default enrollmentSchema;
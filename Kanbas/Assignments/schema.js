import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  availableFrom: Date,
  due: Date,
  until: Date,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModel",
    required: true,
  }
},
  { collection: "assignments" }
);
export default assignmentSchema;
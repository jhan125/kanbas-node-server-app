import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel"
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseModel",
      required: true,
    },
    grade: Number,
    letterGrade: Number,
    enrollmentDate: Date,
    status: {
      type: String,
      enum: ["ENROLLED", "DROPPED", "COMPLETED"],
      default: "ENROLLED",
    },
  },
  { collection: "enrollments" }
);
export default enrollmentSchema;

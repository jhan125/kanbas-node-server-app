import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: String,
  number: String,
  image: String,
  color: String,
  startDate: Date,
  endDate: Date,
  department: String,
  credits: Number,
  description: String,
},
  { collection: "courses" }
);
export default courseSchema;
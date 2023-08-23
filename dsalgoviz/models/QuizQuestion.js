import mongoose from "mongoose";

const schema = new mongoose.Schema({
  quiz: String,
  question: String,
  answers: [String],
  correctAnswer: Number, // index
});

const QuizQuestion = mongoose.model("QuizQuestion", schema);

export default QuizQuestion;

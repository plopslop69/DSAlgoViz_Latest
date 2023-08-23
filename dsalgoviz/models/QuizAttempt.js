import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    answers: [String],
    score: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model("QuizAttempt", schema);

export default QuizAttempt;

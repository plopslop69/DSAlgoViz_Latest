import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  algoViewed: [String],
  role: {
    type: String,
    default: "student", // "student", "teacher"
  },
  image: String,
  quizAttempt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizAttempt",
  },
});

const User = mongoose.model("User", schema);

export default User;

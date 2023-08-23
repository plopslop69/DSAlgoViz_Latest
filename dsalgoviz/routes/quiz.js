import { Router } from "express";

import User from "../models/User.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = Router();

router
  .route("/quiz")
  .get(async (req, res) => {
    try {
      if (!res.locals.isLoggedIn) return res.redirect("/login");

      if (res.locals.user.quizAttempt) {
        return res.render("info-page", {
          info: "Quiz already taken",
          page: "quiz",
        });
      }

      const questions = await QuizQuestion.find();

      if (questions.length === 0) {
        return res.render("info-page", {
          page: "quiz",
          info: "Question isn't created yet",
        });
      }

      res.render("quiz", { data: questions });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong");
    }
  })
  .post(async (req, res) => {
    console.log(req.body);
    try {
      if (!res.locals.isLoggedIn) return res.redirect("/login");
      let totalMarks = 0;

      const quizes = await QuizQuestion.find();

      if (quizes.length !== Object.keys(req.body).length) {
        return res.render("quiz");
      }

      quizes.forEach((quiz, i) => {
        const realAnswer = quiz.answers[quiz.correctAnswer];
        if (realAnswer === req.body[quiz.id]) {
          totalMarks++;
        }
      });

      const user = await User.findById(req.session.userId);

      const attempt = await QuizAttempt.create({
        answers: Object.values(req.body),
        score: totalMarks,
        user: user.id,
      });

      user.quizAttempt = attempt.id;

      user.save();

      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.send("Something went wrong");
    }
  });

router
  .route("/create-quiz")
  .post(async (req, res) => {
    try {
      const quizes = [];
      let title = "";

      const body = Object.keys(req.body);

      for (let i = 0; i < body.length; i++) {
        const key = body[i];
        let val = req.body[key];

        if (key === "title") {
          title = val;
          continue;
        }

        const [_, quesionId, realKey] = key.match(/([0-9]+)-(.*)/);
        const index = +quesionId - 1;

        if (realKey === "valid") {
          val = +val;
        }

        if (!quizes[index]) {
          quizes[index] = {
            id: index,
            [realKey]: val,
          };
        } else {
          quizes[index][realKey] = val;
        }
      }

      if (!title) {
        return res.render("create-quiz", {
          errors: { title: "Enter valid title" },
        });
      }

      for (const quiz of quizes) {
        const errors = {};
        if (!quiz.question) errors.question = "Enter valid question";
        if (!quiz.valid) errors.question = "Select a valid option";

        if (Object.keys(errors) > 0) {
          return res.render("create-quiz", { errors });
        }
      }

      for (const quiz of quizes) {
        await QuizQuestion.create({
          quiz: title,
          question: quiz.question,
          answers: quiz.option,
          correctAnswer: quiz.valid,
        });
      }

      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.send("Something went wrong");
    }
  })
  .get(async (req, res) => {
    try {
      if ((await QuizQuestion.find()).length > 0) {
        return res.render("info-page", {
          info: "Question already created",
          page: "quiz",
        });
      }
    } catch (err) {}
    res.render("create-quiz");
  });

export default router;

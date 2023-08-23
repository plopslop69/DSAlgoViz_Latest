import express from "express";
import session from "express-session";

import mainRouter from "./routes/main.js";
import quizRouter from "./routes/quiz.js";
import userRouter from "./routes/user.js";
import connectDb from "./utils/connectDb.js";
import algoRouter from "./routes/algorithm.js";
import resourceRouter from "./routes/resources.js";
import fileRouter from "./routes/file.js";

import User from "./models/User.js";

process.on("uncaughtException", function (err) {
  console.log(err);
});

const main = async () => {
  const app = express();

  app.set("view engine", "ejs");
  app.set("trust proxy", 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/uploads", express.static("uploads"));

  app.use(async (req, res, next) => {
    // req.session.userId = "64bcb63d7b739e27d978ef01";
    let user;
    if (typeof req.session.userId === "string") {
      user = await User.findById(req.session.userId).populate("quizAttempt");
    }

    res.locals.user = user;
    res.locals.isLoggedIn = user ? true : false;

    next();
  });

  app.use(mainRouter);
  app.use(userRouter);
  app.use(resourceRouter);
  app.use(quizRouter);
  app.use(fileRouter);
  app.use("/algorithms", algoRouter);

  app.use("/test", (req, res) => {
    res.send(`The session is ` + req.session.userId);
  });

  const PORT = process.env.PORT || 4000;

  await connectDb();

  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
};

main().catch(console.log);

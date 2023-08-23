import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const router = Router();

router
  .route("/login")
  .post(async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const errors = {};

      if (typeof email !== "string" || !email.trim())
        errors.email = "Enter valid email";
      if (!password) errors.password = "Enter valid password";

      if (Object.keys(errors).length > 0) {
        return res.render("login", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.email = "Invalid credentials";
      } else {
        const isCorrectPassword = await bcrypt.compare(
          password,
          user?.password
        );

        if (!isCorrectPassword) {
          errors.password = "Invalid credentials";
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.render("login", { errors });
      }

      req.session.userId = user.id;
      req.session.save();

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.render("Something went wrong");
    }
  })
  .get((req, res) => {
    if (res.locals.isLoggedIn) return res.redirect("/");

    res.render("login", { errors: {} });
  });

router
  .route("/signup")
  .post(async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      let password = req.body.password;

      const errors = {};

      if (!name?.trim()) errors.name = "Enter valid name";
      if (!email?.trim()) errors.email = "Enter valid email";
      if (!password) errors.password = "Enter valid password";

      if (Object.keys(errors).length === 0) {
        if (await User.findOne({ email })) {
          errors.email = "Email already exists";
        }
      }

      if (Object.keys(errors).length !== 0) {
        return res.render("signup", { errors });
      }

      password = await bcrypt.hash(password, 12);

      const user = await User.create({ name, email, password });

      req.session.userId = user.id;
      req.session.save();

      res.redirect("/");
    } catch (error) {
      res.send("Something went wrong");
    }
  })
  .get((req, res) => {
    if (res.locals.isLoggedIn) return res.redirect("/");

    res.render("signup", { errors: {} });
  });

router.route("/profile").get((req, res) => {
  if (!res.locals.isLoggedIn) return res.redirect("/");

  res.render("profile");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;

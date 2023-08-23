import { Router } from "express";
import User from "../models/User.js";

const router = Router();

let validAlgo = [
  "stack",
  "avl-tree",
  "sort",
  "search",
  "shortest",
  "toh",
  "queue",
  "hash",
];

router.get("/:algo", (req, res) => {
  let algo = req.params.algo;
  if (!algo || !validAlgo.includes(algo)) algo = validAlgo[0];

  try {
    if (res.locals.isLoggedIn) {
      User.findById(req.session.userId).then((user) => {
        const algoViewed = [...(user.algoViewed || []), algo];
        user.algoViewed = algoViewed;
        user.save();
      });
    }
  } catch (error) {}

  res.render(`algorithms/${algo}`);
});

export default router;

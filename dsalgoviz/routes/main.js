import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/visualizer", (req, res) => {
  res.render("visualizer");
});

router.get("/learn", (req, res) => {
  res.render("learn");
});

router.get("/visualize", (req, res) => {
  res.render("visualize");
});

export default router;

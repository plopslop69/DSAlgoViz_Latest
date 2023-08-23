import fs from "fs/promises";
import { Router } from "express";

const router = Router();

const resources = {
  stack: "Chapter 2 Stack and Queue.pdf",
  "avl-tree": "Chapter 6 Tree.pdf",
  sort: "Chapter 7 Sorting.pdf",
  search: "Chapter 8 Searching.pdf",
  toh: "Chapter 5 Recursion.pdf",
  queue: "Chapter 2 Stack and Queue.pdf",
  hash: "hashing.pdf",
};

router.get("/resources", async (req, res) => {
  if (!res.locals.isLoggedIn) return res.redirect("/login");

  let uploads = [];
  try {
    uploads = await fs.readdir("uploads");
  } catch (err) {}

  res.render("resources", { uploads });
});

router.get("/resources/:resource", (req, res) => {
  let key = req.params.resource;

  let resource = resources.stack;
  if (key && resources[key]) {
    resource = resources[key];
  }

  res.render("resource", {
    resource,
    title: resource.replace(/Chapter [0-9] /, "").replace(".pdf", ""),
  });
});

export default router;

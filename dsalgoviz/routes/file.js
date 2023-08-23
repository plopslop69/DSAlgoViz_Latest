import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/fileupload", upload.single("file"), (req, res) => {
  console.log(req.body);
  res.redirect("/profile");
});

export default router;

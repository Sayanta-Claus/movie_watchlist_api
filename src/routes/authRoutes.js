import express from "express";
import { login, logout, register } from "../controllers/authController.js";
const router = express.Router(); //to keep  api routes together here

// router.get("/hello", (req, res) => {
//   res.json({ message: "Hello world from movie api!" });
// });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;

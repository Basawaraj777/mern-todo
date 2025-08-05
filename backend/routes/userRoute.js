import express from "express";

import {
  signUp,
  login,
  logout,
  protect,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.use(protect);
router.get("/logout", logout);

export default router;

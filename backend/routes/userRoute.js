import express from "express";

import {
  signUp,
  login,
  logout,
  protect,
  getProfile,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.use(protect);
router.get("/profile", getProfile);
router.get("/logout", logout);

export default router;

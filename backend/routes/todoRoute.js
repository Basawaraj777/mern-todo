import express from "express";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} from "../controllers/TaskController.js";
import { protect } from "../controllers/UserController.js";

const router = express.Router();

router.use(protect);

// RESTful, clean routes
router.get("/", getTodos);
router.post("/", createTodo);
router.post("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;

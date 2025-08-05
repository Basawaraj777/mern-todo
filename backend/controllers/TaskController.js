import Todo from "../models/ToDoModel.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // 1. Create Todo in DB
    const todo = await Todo.create({
      title,
      description,
      status: status || "pending",
      dueDate,
      user: req.user.id,
    });

    // 3. Return created todo
    res.status(201).json({
      success: true,
      message: "Todo created and reminder scheduled.",
      todo,
    });
  } catch (err) {
    console.error("❌ Error in createTodo:", err.message);
    res.status(500).json({ error: "Failed to create todo" });
  }
};
export const getTodos = async (req, res) => {
  try {
    const query = { user: req.user.id };

    if (req.query.status) {
      query.status = req.query.status; // Optional filter
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

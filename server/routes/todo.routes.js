const express = require("express");
const {
  createTodo,
  editTodo,
  deleteTodo,
  getAllTodosByUserId,
  getTodoById,
  markTodoAsCompleted
} = require("../controllers/todo.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create a new todo
router.post("/create", authMiddleware, createTodo);

// Edit a todo by ID
router.put("/edit/:id", authMiddleware, editTodo);

// Delete a todo by ID
router.delete("/delete/:id", authMiddleware, deleteTodo);

// Get all todos for a user by userId
router.get("/list", authMiddleware, getAllTodosByUserId);

// Get todo by ID
router.get("/:id", authMiddleware, getTodoById);

// Mark a todo as completed
router.put("/mark-completed/:id", authMiddleware, markTodoAsCompleted);

module.exports = router;

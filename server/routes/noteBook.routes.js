const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { createNotebook, getAllNotebooks, getNotebookById, updateNotebook, deleteNotebook } = require("../controllers/noteBook.controller");

const router = express.Router();

// Create a new notebook
router.post("/", authMiddleware, createNotebook);

// Get all notebooks for a user
router.get("/", authMiddleware, getAllNotebooks);

// Get a single notebook by ID
router.get("/:id",authMiddleware,  getNotebookById);

// Update a notebook
router.put("/:id", authMiddleware, updateNotebook);

// Delete a notebook (soft delete)
router.delete("/:id",authMiddleware,  deleteNotebook);

module.exports = router;

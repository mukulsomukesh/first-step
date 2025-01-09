const express = require("express");
const {
  createNote,
  editNote,
  deleteNote,
  getAllNotesByUserId,
  getNoteById
} = require("../controllers/notes.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create a new note
router.post("/create", authMiddleware, createNote);

// Edit a note by ID
router.put("/edit/:id", authMiddleware, editNote);

// Delete a note by ID
router.delete("/delete/:id", authMiddleware, deleteNote);

// Get all notes for a user by userId
router.get("/list", authMiddleware, getAllNotesByUserId);

// Get note rich text
router.get("/:id", authMiddleware, getNoteById);

module.exports = router;

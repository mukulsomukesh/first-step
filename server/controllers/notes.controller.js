const Note = require("../modals/notes.modal"); // Import Note model
const Reminder = require("../modals/notes.reminder.modal"); // Import Reminder model

// Create a new note
const createNote = async (req, res) => {
  const { title, content, reminderEnabled } = req.body;
  const userId = req.user._id; // Access the user ID from the authenticated user in the request

  try {
    const note = await Note.create({ title, content, reminderEnabled, userId });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create note",
      error: error.message,
    });
  }
};

// Edit an existing note
const editNote = async (req, res) => {
  const { id } = req.params; // Note ID
  const { title, content, reminderEnabled, status } = req.body;
  const userId = req.user._id; // Access the user ID from the authenticated user

  try {
    // Ensure that the note belongs to the authenticated user
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId }, // Ensure the note belongs to the logged-in user
      { title, content, reminderEnabled, status },
      { new: true, runValidators: true } // Return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params; // Note ID
  const userId = req.user._id; // Access the user ID from the authenticated user

  try {
    // Ensure that the note belongs to the authenticated user
    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// Get all notes for a user
const getAllNotesByUserId = async (req, res) => {
  const userId = req.user._id; // Access the user ID from the authenticated user

  try {
    const notes = await Note.find({ userId });

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve notes",
      error: error.message,
    });
  }
};

// Get a note by noteId including reminder details
const getNoteById = async (req, res) => {
  const { id } = req.params; // Note ID
  const userId = req.user._id; // Access the user ID from the authenticated user

  try {
    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or unauthorized access",
      });
    }

    // Find the reminder associated with the note, if reminderEnabled is true
    let reminder = null;
    if (note.reminderEnabled) {
      reminder = await Reminder.findOne({ noteId: note._id });
    }

    // Return note along with reminder data (if exists)
    res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: {
        note,
        reminder,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve note",
      error: error.message,
    });
  }
};

module.exports = {
  getNoteById,
  createNote,
  editNote,
  deleteNote,
  getAllNotesByUserId,
};

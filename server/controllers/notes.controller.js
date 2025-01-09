const asyncHandler = require("express-async-handler");
const Note = require("../modals/notes.modal"); // Import Note model
const Reminder = require("../modals/notes.reminder.modal"); // Import Reminder model

// Create a new note
// Create a new note with reminders
const createNote = asyncHandler(async (req, res) => {
  const { title, content, reminderEnabled, upcomingReminders } = req.body;
  const userId = req.user._id; // Access the user ID from the authenticated user in the request

  try {
    // Step 1: Create the note
    const note = await Note.create({
      title,
      content,
      reminderEnabled,
      userId,
    });

    // Step 2: Save reminders if reminderEnabled is true
    if (reminderEnabled && upcomingReminders && upcomingReminders.length > 0) {
      // Map through the reminder dates and create reminder documents
      const remindersData = upcomingReminders.map((reminder) => {
        return {
          noteId: note._id, // Link reminder to the created note
          reminderDate: reminder.reminderDate,
          reminderTime: reminder.reminderDate.slice(11), // Extract time (HH:mm:ss)
        };
      });

      // Create all reminders for this note
      await Reminder.insertMany(remindersData);
    }

    res.status(201).json({
      success: true,
      message: "Note created successfully with reminders",
      data: note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating note with reminders",
    });
  }
});

// Edit an existing note
const editNote = asyncHandler(async (req, res) => {
  const { id } = req.params; // Note ID
  const { title, content, reminderEnabled, status } = req.body;
  const userId = req.user._id; // Access the user ID from the authenticated user

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
});

// Delete a note
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params; // Note ID
  const userId = req.user._id; // Access the user ID from the authenticated user

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
});

// Get all notes for a user
const getAllNotesByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Access the user ID from the authenticated user

  const notes = await Note.find({ userId });

  res.status(200).json({
    success: true,
    message: "Notes retrieved successfully",
    data: notes,
  });
});

// Get a note by noteId including reminder details
const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Note ID
  const userId = req.user._id; // Access the user ID from the authenticated user

  const note = await Note.findOne({ _id: id, userId });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found or unauthorized access",
    });
  }

  let reminder = null;
  if (note.reminderEnabled) {
    reminder = await Reminder.find({ noteId: note._id });
  }

  res.status(200).json({
    success: true,
    message: "Note retrieved successfully",
    data: {
      note,
      reminder,
    },
  });
});

module.exports = {
  getNoteById,
  createNote,
  editNote,
  deleteNote,
  getAllNotesByUserId,
};

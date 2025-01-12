const asyncHandler = require("express-async-handler");
const Note = require("../modals/notes.modal"); // Import Note model
const Reminder = require("../modals/notes.reminder.modal"); // Import Reminder model
const userModal = require("../modals/user.modal");

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

// Edit an existing note with reminder changes
const editNote = asyncHandler(async (req, res) => {
  const { id } = req.params; // Note ID
  const { title, content, reminderEnabled, status, upcomingReminders } = req.body;
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

  // Handle reminder updates
  if (reminderEnabled && upcomingReminders && upcomingReminders.length > 0) {
    // Remove existing reminders for the note
    await Reminder.deleteMany({ noteId: id });

    // Map through the reminder dates and create new reminder documents
    const remindersData = upcomingReminders.map((reminder) => {
      return {
        noteId: id, // Link reminder to the updated note
        reminderDate: reminder.reminderDate,
        reminderTime: reminder.reminderDate.slice(11), // Extract time (HH:mm:ss)
      };
    });

    // Create all new reminders for this note
    await Reminder.insertMany(remindersData);
  } else {
    // If reminders are not enabled, remove existing reminders
    await Reminder.deleteMany({ noteId: id });
  }

  res.status(200).json({
    success: true,
    message: "Note and reminders updated successfully",
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


// Get notes based on reminder conditions
const getNotesByReminderStatus = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user._id` is set after user authentication

    // Get user details
    const user = await userModal.findById(userId).select('name email createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the current date and normalize it (start of today in UTC)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to midnight

    // Get the end of today (just before midnight of tomorrow)
    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999); // Set to the last millisecond of the day

    // Get the list of notes that need revision today (reminderDate is today)
    const notesToReviseToday = await Reminder.find({
      noteId: { $in: await Note.find({ userId }).select('_id') },
      reminderDate: { $gte: startOfToday, $lt: endOfToday }, // Reminder date is today
      isRevisionDone: false, // Revision not done yet
    })
      .populate('noteId') // Populate the note details
      .exec();

    // Get the list of past notes that haven't been revised yet
    const pastNotesToRevise = await Reminder.find({
      noteId: { $in: await Note.find({ userId }).select('_id') },
      reminderDate: { $lt: startOfToday }, // Past reminders
      isRevisionDone: false, // Revision not done yet
      isDeactivated: false, // Not deactivated
    })
      .populate('noteId') // Populate the note details
      .exec();

    // Format the notes that need revision today (only title)
    const notesForRevisionToday = notesToReviseToday.map((reminder) => ({
      noteTitle: reminder.noteId.title,        // Title of the note
      reminderHistory: {
        reminderDate: reminder.reminderDate,   // Reminder date
        reminderTime: reminder.reminderTime,   // Reminder time
        isRevisionDone: reminder.isRevisionDone, // Status of revision
      },
      otherDetails: {
        reminderId: reminder._id,               // Reminder ID
        noteId: reminder.noteId._id,            // Note ID
      },
    }));

    // Format the past notes that need revision (for past dates, only title)
    const pastNotesForRevision = pastNotesToRevise.map((reminder) => ({
      noteTitle: reminder.noteId.title,        // Title of the note
      reminderHistory: {
        reminderDate: reminder.reminderDate,   // Reminder date
        reminderTime: reminder.reminderTime,   // Reminder time
        isRevisionDone: reminder.isRevisionDone, // Status of revision
      },
      otherDetails: {
        reminderId: reminder._id,               // Reminder ID
        noteId: reminder.noteId._id,            // Note ID
      },
    }));

    // Prepare the response data
    const responseData = {
      notesForRevisionToday,
      pastNotesForRevision,
    };

    // Send the response
    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});




module.exports = {
  getNoteById,
  createNote,
  editNote,
  deleteNote,
  getAllNotesByUserId,
  getNotesByReminderStatus
};

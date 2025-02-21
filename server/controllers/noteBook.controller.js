const NoteBook = require("../modals/noteBook.modal");
const Note = require("../modals/notes.modal");
const asyncHandler = require("express-async-handler");


// Create a new notebook
exports.createNotebook = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user._id;

  const newNotebook = await NoteBook.create({ title, userId });

  res.status(201).json({
    success: true,
    message: "Notebook created successfully",
    data: newNotebook,
  });
});

// Get all notebooks for a user
exports.getAllNotebooks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notebooks = await NoteBook.aggregate([
    {
      $match: { userId: userId, status: { $ne: "deleted" } }
    },
    {
      $lookup: {
        from: "notes", // Collection name (lowercase plural of model name)
        localField: "_id",
        foreignField: "noteBookID",
        as: "notes"
      }
    },
    {
      $addFields: {
        activeNotesCount: {
          $size: {
            $filter: {
              input: "$notes",
              as: "note",
              cond: { $eq: ["$$note.status", "active"] }
            }
          }
        }
      }
    },
    {
      $project: {
        notes: 0, // Exclude the notes array to avoid unnecessary data
      }
    },
    { $sort: { createdAt: -1 } } // Sort notebooks by creation date
  ]);
  res.status(200).json({ success: true, data: notebooks });
});

// Get a single notebook by ID and include its notes
exports.getNotebookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notebook = await NoteBook.findOne({ _id: id, status: { $ne: "deleted" } });

  if (!notebook) {
    return res.status(404).json({ success: false, message: "Notebook not found" });
  }

  const notes = await Note.find({ noteBookID: id, status: { $ne: "deleted" } });

  res.status(200).json({ success: true, data: { notebook, notes } });
});

// Update a notebook
exports.updateNotebook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  const updatedNotebook = await NoteBook.findByIdAndUpdate(
    id,
    { title, status },
    { new: true, runValidators: true }
  );

  if (!updatedNotebook) {
    return res.status(404).json({ success: false, message: "Notebook not found" });
  }

  res.status(200).json({ success: true, message: "Notebook updated", data: updatedNotebook });
});

// Soft delete a notebook
exports.deleteNotebook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedNotebook = await NoteBook.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true }
  );

  if (!deletedNotebook) {
    return res.status(404).json({ success: false, message: "Notebook not found" });
  }

  res.status(200).json({ success: true, message: "Notebook deleted" });
});

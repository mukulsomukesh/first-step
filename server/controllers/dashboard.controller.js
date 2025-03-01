const asyncHandler = require("express-async-handler");
const NoteBook = require("../modals/noteBook.modal");
const Note = require("../modals/notes.modal");
const Reminder = require("../modals/notes.reminder.modal");
const Todo = require("../modals/todo.model");

exports.dashboardStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      dateFilter = { $gte: start, $lte: end };
    } else {
      // Default to today if no range is given
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setUTCHours(23, 59, 59, 999);
      dateFilter = { $gte: today, $lt: tomorrow };
    }

    // Common filter for all collections based on createdAt
    const baseFilter = { userId, createdAt: dateFilter };

    // Fetch required data
    const createdNotes = await Note.countDocuments(baseFilter);
    const createdNotebooks = await NoteBook.countDocuments(baseFilter);
    const todosCreated = await Todo.countDocuments(baseFilter);
    const todosCompleted = await Todo.countDocuments({
      userId,
      createdAt: dateFilter,
      status: "done",
    });

    // **Step 1: Get all note IDs for the user**
    const userNotes = await Note.find({ userId }).select("_id");
    const userNoteIds = userNotes.map((note) => note._id);

    // **Step 2: Use note IDs to filter reminders**
    const revisionsScheduled = await Reminder.countDocuments({
      noteId: { $in: userNoteIds },
      reminderDate: dateFilter, // Ensuring only requested date range
      isDeactivated: false,
    });

    const revisionsDone = await Reminder.countDocuments({
      noteId: { $in: userNoteIds },
      reminderDate: dateFilter,
      isDeactivated: false,
      isRevisionDone: true,
    });

    const revisionMissed = await Reminder.countDocuments({
      noteId: { $in: userNoteIds },
      reminderDate: dateFilter,
      isRevisionDone: false,
      isDeactivated: false,
      reminderDate: { $lt: new Date() }, // Past due date
    });

    // Additional stats (all-time totals)
    const totalNotebooks = await NoteBook.countDocuments({ userId });
    const totalNotes = await Note.countDocuments({ userId });
    const totalTodos = await Todo.countDocuments({ userId });

    res.status(200).json({
      message:"Dashboard stats fetched successfully",
      data:{createdNotes,
        createdNotebooks,
        todosCreated,
        todosCompleted,
        revisionsScheduled,
        revisionsDone,
        revisionMissed,
        totalNotebooks,
        totalNotes,
        totalTodos,
        startDate,
        endDate,
  }
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
});

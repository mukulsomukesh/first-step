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
      message: "Dashboard stats fetched successfully",
      data: {
        createdNotes,
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
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
});

exports.scheduledRevisionsAndTodos = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      dateFilter = { $gte: start, $lte: end };
    } else {
      // Default to upcoming scheduled items
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      dateFilter = { $gte: today };
    }

    // **Step 1: Get all user's notes along with notebook info**
    const userNotes = await Note.find({ userId })
      .populate("noteBookID", "title") // Get notebook title
      .select("_id title noteBookID");

    // Map notes to store unique note data
    const noteMap = new Map();
    userNotes.forEach((note) => {
      noteMap.set(note._id.toString(), {
        title: note.title,
        notebook: note.noteBookID ? note.noteBookID.title : "No Notebook",
        previousReminders: [],
        latestScheduledRevision: null,
      });
    });

    // **Step 2: Get All Scheduled Revisions**
    const scheduledRevisions = await Reminder.find({
      noteId: { $in: Array.from(noteMap.keys()) },
      reminderDate: dateFilter,
      isDeactivated: false,
    })
      .select("noteId reminderDate")
      .sort({ reminderDate: -1 }); // Sorting from newest to oldest

    // **Step 3: Attach Latest Scheduled Revision to Notes**
    scheduledRevisions.forEach((revision) => {
      if (noteMap.has(revision.noteId.toString())) {
        noteMap.get(revision.noteId.toString()).latestScheduledRevision =
          revision.reminderDate;
      }
    });

    // **Step 4: Get Previous Reminders**
    const previousReminders = await Reminder.find({
      noteId: { $in: Array.from(noteMap.keys()) },
      reminderDate: { $lt: new Date() }, // Only past reminders
      isDeactivated: false,
    })
      .select("noteId reminderDate isRevisionDone")
      .sort({ reminderDate: -1 }); // Sorting from newest to oldest

    // Add previous reminders to the corresponding note
    previousReminders.forEach((reminder) => {
      if (noteMap.has(reminder.noteId.toString())) {
        noteMap.get(reminder.noteId.toString()).previousReminders.push({
          reminderDate: reminder.reminderDate,
          isRevisionDone: reminder.isRevisionDone,
        });
      }
    });

    // **Step 5: Sort Notes by Most Recent Scheduled Revision**
    const uniqueNotesList = Array.from(noteMap.values()).sort((a, b) => {
      return (
        new Date(b.latestScheduledRevision || 0) -
        new Date(a.latestScheduledRevision || 0)
      );
    });

    // **Step 6: Get Pending Todos**
    const pendingTodos = await Todo.find({
      userId,
      endDate: dateFilter,
    });

    const data = {
      scheduledRevisions: uniqueNotesList,
      pendingTodos: pendingTodos,
    };

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Failed to fetch scheduled revisions and todos", error);
    res.status(500).json({ message: "Failed to fetch data", error });
  }
});

exports.getStudyProgressChartData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    let { startDate, endDate } = req.query;

    // Set default values if not provided
    if (!startDate) {
      startDate = '2024-02-10';
    }
  
    if (!endDate) {
      const today = new Date();
      endDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }
  
    // Construct ISO date range
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      dateFilter = { $gte: start, $lte: end };
    } else {
      // Default: Last 4 weeks
      const today = new Date();
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 28);
      dateFilter = { $gte: pastMonth, $lte: today };
    }

    // **Step 1: Get All Notes for User**
    const userNotes = await Note.find({ userId }).select("_id");
    const userNoteIds = userNotes.map((note) => note._id);

    // **Step 2: Get Study Progress (Revisions Done)**
    const revisionsData = await Reminder.aggregate([
      {
        $match: {
          noteId: { $in: userNoteIds }, // Only fetch user's notes
          reminderDate: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$reminderDate" },
            week: { $week: "$reminderDate" },
          },
          revised: { $sum: { $cond: ["$isRevisionDone", 1, 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);

    // **Step 3: Get Notes & Notebooks Created (Grouped by Week)**
    const notesData = await Note.aggregate([
      {
        $match: {
          userId,
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          notes: { $sum: 1 },
        },
      },
    ]);

    const notebooksData = await NoteBook.aggregate([
      {
        $match: {
          userId,
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          notebooks: { $sum: 1 },
        },
      },
    ]);

    // **Step 4: Merge Data**
    const progressMap = new Map();

    revisionsData.forEach((entry) => {
      const key = `${entry._id.year}-W${entry._id.week}`;
      progressMap.set(key, {
        week: `Week ${entry._id.week}`,
        notebooks: 0,
        notes: 0,
        revised: entry.revised,
      });
    });

    notesData.forEach((entry) => {
      const key = `${entry._id.year}-W${entry._id.week}`;
      if (!progressMap.has(key)) {
        progressMap.set(key, {
          week: `Week ${entry._id.week}`,
          notebooks: 0,
          notes: entry.notes,
          revised: 0,
        });
      } else {
        progressMap.get(key).notes = entry.notes;
      }
    });

    notebooksData.forEach((entry) => {
      const key = `${entry._id.year}-W${entry._id.week}`;
      if (!progressMap.has(key)) {
        progressMap.set(key, {
          week: `Week ${entry._id.week}`,
          notebooks: entry.notebooks,
          notes: 0,
          revised: 0,
        });
      } else {
        progressMap.get(key).notebooks = entry.notebooks;
      }
    });

    // Convert Map to Array & Sort by Week
    const finalProgress = Array.from(progressMap.values()).sort((a, b) => {
      return parseInt(a.week.split(" ")[1]) - parseInt(b.week.split(" ")[1]);
    });

    res.status(200).json({
      studyProgress: finalProgress,
    });
  } catch (error) {
    console.error("Failed to fetch study progress", error);
    res.status(500).json({ message: "Failed to fetch data", error });
  }
});

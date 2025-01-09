const mongoose = require('mongoose');

// Reminder Schema
const reminderSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note', // Reference to the Note model
      required: true,
    },
    reminderDate: {
      type: Date, // Date for the reminder
      required: [true, 'Reminder date is required'],
    },
    reminderTime: {
      type: String, // Time for the reminder (e.g., 'HH:mm:ss')
      required: [true, 'Reminder time is required'],
    },
    isDelivered: {
      type: Boolean, // Tracks if the reminder has been sent
      default: false,
    },
    isRevisionDone: {
      type: Boolean, // Tracks if the user has completed the revision
      default: false,
    },
    isDeactivated: {
      type: Boolean, // Tracks if the reminder is deactivated
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);

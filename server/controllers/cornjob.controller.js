const { sendEmail } = require('../helperFunctions/sendEmail');
const userModal = require("../modals/user.modal");
const noteModal = require("../modals/notes.modal"); // Import Note model
const asyncHandler = require('express-async-handler'); // Ensure you have this package installed

const sendReminders = asyncHandler(async (req, res) => {
  try {
    // Fetch notes with reminder enabled
    const notes = await noteModal.find({ reminderEnabled: true });

    // Create a map to store all notes for each user
    const userNotesMap = {};

    // Iterate over notes to check and organize reminders by user
    for (const note of notes) {
      const user = await userModal.findById(note.userId);

      // Check if user already exists in the map
      if (!userNotesMap[user.email]) {
        userNotesMap[user.email] = {
          user,
          notes: [],
        };
      }

      // Add the note to the user's notes list
      userNotesMap[user.email].notes.push(note);
    }

    // Send reminder emails to each user with all their notes
    for (const email in userNotesMap) {
      const user = userNotesMap[email].user;
      const notesList = userNotesMap[email].notes;

      // Prepare HTML content for the email
      let htmlContent = `
        <div style="background-color: #f1f4f9; font-size:18px; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #352fa5;">Hi ${user.name},</h1>
          <p style="color: #6b7280; font-size:18px;">This is a reminder to revise your notes:</p>
          <ul style="color: #374151; font-size:18px;">
      `;

      // Generate a list of all notes with links
      notesList.forEach(note => {
        const noteLink = `${process.env.FRONTEND_URL}/pages/notes/read/${note._id}`;
        htmlContent += `
          <li>
            <a href="${noteLink}" style="color: #352fa5; font-size:18px; text-decoration: none;">${note.title}</a>
          </li>
        `;
      });

      // Add the dashboard link at the end
      htmlContent += `
          </ul>
          <p style="color: #6b7280; font-size:18px;">To view your dashboard and manage your notes, click the button below:</p>
          <a href="${process.env.FRONTEND_URL}/pages/dashboard" style="font-size:18px; background-color: #352fa5; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
        </div>
      `;

      // Send the email with the prepared content
      const mailOptions = {
        recipient: user.email, // The recipient's email
        subject: 'Revision Reminder',
        htmlContent: htmlContent, // The HTML content of the email
      };

      // Use the sendEmail helper to send the email
      await sendEmail(mailOptions);
      console.log(`Reminder sent to ${user.email}`);
    }

    res.status(200).json({ success: true, message: "Reminders processed successfully." });
  } catch (error) {
    console.error('Error sending reminders:', error.message);
    res.status(500).json({ success: false, message: 'Error sending reminders.' });
  }
});

module.exports = { sendReminders };

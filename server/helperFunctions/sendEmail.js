const nodemailer = require("nodemailer");



const sendEmail = async ({ recipient, subject, htmlContent }) => {
  try {
    // Create a transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_SMTP_EMAIL, // Your Gmail address
        pass: process.env.GOOGLE_SMTP_PASSWORD, // Your Gmail password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Note Master" <${process.env.GOOGLE_SMTP_EMAIL}>`, // Sender name and email
      to: recipient, // Recipient email address
      subject: subject, // Email subject
      html: htmlContent, // Email body in HTML format
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
    return {
      success: true,
      message: `Email sent successfully to ${recipient}`,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};


module.exports = { sendEmail };

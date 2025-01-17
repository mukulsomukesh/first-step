const asyncHandler = require("express-async-handler");
const userModal = require("../modals/user.modal");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helperFunctions/sendEmail");

// Helper to create JWT
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyExist = await userModal.findOne({ email });
  if (alreadyExist) {
    res.status(400).json({
      success: false,
      data: "Email already exists",
    });
    return;
  }

  const user = await userModal.create({ name, email, password });
  res.status(201).json({
    success: true,
    data: user,
  });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModal.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const jwtToken = createToken(user);

  res.status(200).json({
    success: true,
    Details: {
      role: user.role,
      profilePicture: user.profilePicture,
      email: user.email,
      name: user.name,
    },
    jwtToken: jwtToken,
    message: "User Login Success",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await userModal.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Generate unique OTP
  let otp = generateUniqueOTP();
  // Ensure the OTP is unique in the database
  while (await userModal.findOne({ otp })) {
    otp = generateUniqueOTP();
  }

  // Save OTP to user's record with a timestamp
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  // Send OTP to user's email
  const subject = "Password Reset OTP";
  const htmlContent = `
    <h1>Password Reset Request</h1>
    <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
    <p> reset password like </p> <a href="${process.env.FRONTEND_URL}/pages/update-password?otp=${otp}"> click here </a>
  `;
  await sendEmail({ recipient: email, subject, htmlContent });

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

const setNewPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;

  // Find user by OTP and ensure OTP is not expired
  const user = await userModal.findOne({
    otp,
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  // Set new password
  user.password = newPassword;
  user.otp = undefined; // Clear OTP
  user.otpExpiresAt = undefined; // Clear OTP expiry time
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});


const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is already available from authentication middleware
    const user = await userModal.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update User Profile with Profile Picture Upload to Cloudinary
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, profilePicture } = req.body;
  // Get the user ID from the request (from authentication middleware)
  const userId = req.user.id;

  // Find user by ID
  const user = await userModal.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update user fields if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (profilePicture) user.profilePicture = profilePicture;

  // Save updated user to the database
  console.log(" user", user);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });
});

const generateUniqueOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  setNewPassword,
  getUserProfile,
  updateUserProfile,
};

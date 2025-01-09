const userModal = require("../modals/user.modal");
const jwt = require("jsonwebtoken");

// Helper to create JWT
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ,
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const alreadyExist = await userModal.findOne({ email });
    if (alreadyExist) {
      res.status(400).json({
        success: false,
        data: "Email already exist",
      });
    }

    const user = await userModal.create({ name, email, password });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModal.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = createToken(user)

    res.status(200).json({
      success: true,
      Details:{
        role:user.role, 
        profilePicture:user.profilePicture, 
        email:user.email, 
        name:user.name, 
      },
      jwtToken:jwtToken,
      message:"User Login Success"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };

const jwt = require('jsonwebtoken');
const User = require('../modals/user.modal'); // Import User model (assuming you have a User model)

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from 'Bearer token'

    console.log(" token ", token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming JWT_SECRET is in your environment variables

    // Find the user by the ID in the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach the user information to req.user
    req.user = user;
    
    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;

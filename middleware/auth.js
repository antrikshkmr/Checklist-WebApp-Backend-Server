// ====================================================== //
// ==== Middleware for handling JWT token validation ==== //
// ====================================================== //

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Get the JWT Secret Key from environment variable
let secretKey = process.env.JWT_SECRET_KEY;

module.exports = function(req, res, next) {
  const token = req.header("token");

  // If token header is empty
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    // Verify JWT
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (e) {
    // If JWT Invalid
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};

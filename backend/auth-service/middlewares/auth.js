// backend/auth-service/middlewares/auth.js
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer"); // if you need to fetch the user

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // 1) Check for Bearer token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not logged in. Please log in first." });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) (Optional) Check that the user still exists
    const user = await Customer.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "The user belonging to this token no longer exists." });
    }

    // 4) Grant access
    req.userId = decoded.id;
    req.userRole = decoded.role;    // e.g. "customer"
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

const jwt = require('jsonwebtoken');
exports.signToken = (payload) => 
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

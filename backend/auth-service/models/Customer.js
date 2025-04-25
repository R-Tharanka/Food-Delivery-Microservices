// backend/auth-service/models/Customer.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  location: {
    type: String,
    required: false,
    trim: true,
    // You could store as { type: "Point", coordinates: [lng, lat] } for geo-queries
  },
});

// Hash password before saving
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain text to hashed
customerSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Customer", customerSchema);

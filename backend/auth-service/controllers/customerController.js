// backend/auth-service/controllers/customerController.js

const jwt        = require("jsonwebtoken");
const Customer   = require("../models/Customer");

// Helper to sign a JWT for a given user ID (and role)
const signToken = (userId) => {
  return jwt.sign(
    { id: userId, role: "customer" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @desc    Register a new customer
// @route   POST /api/auth/register/customer
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, location } = req.body;

    // 1) Check all required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // 2) Prevent duplicate emails
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // 3) Create and save the customer
    const newCustomer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      location,
    });

    // 4) Sign JWT
    const token = signToken(newCustomer._id);

    // 5) Respond
    res.status(201).json({
      status: "success",
      token,
      data: {
        customer: {
          id: newCustomer._id,
          firstName: newCustomer.firstName,
          lastName: newCustomer.lastName,
          email: newCustomer.email,
          phone: newCustomer.phone,
          location: newCustomer.location,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check email & password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 2) Find customer & select password explicitly
    const customer = await Customer.findOne({ email }).select("+password");
    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3) Check password
    const valid = await customer.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4) Generate token
    const token = signToken(customer._id);

    // 5) Respond
    res.json({
      status: "success",
      token,
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          location: customer.location,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged-in customer profile
// @route   GET /api/auth/customer/me
// @access  Private (customer)
exports.getProfile = async (req, res, next) => {
  try {
    // req.userId is set by your auth middleware after validating JWT
    const customer = await Customer.findById(req.userId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({
      status: "success",
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          location: customer.location,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer profile (e.g. phone or location)
// @route   PATCH /api/auth/customer/me
// @access  Private (customer)
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = (({ firstName, lastName, phone, location }) =>
      ({ firstName, lastName, phone, location }))(req.body);

    // Prevent email/password update here (use separate endpoints)
    delete updates.email;
    delete updates.password;

    const customer = await Customer.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({
      status: "success",
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          location: customer.location,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

// Token Generation
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
  });
};

// Input Validation
const validateLoginInput = (email, password) => {
  const errors = {};
  
  if (!validator.isEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Driver Login
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    const { errors, isValid } = validateLoginInput(email, password);
    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        errors 
      });
    }

    // Find Driver
    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
      console.log(`Login attempt failed - driver not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Password Comparison
    const isMatch = await driver.comparePassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed - password mismatch for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Token Generation
    const token = generateToken(driver._id);

    // Response Data
    const driverData = {
      id: driver._id,
      name: driver.name,
      email: driver.email,
      vehicleType: driver.vehicleType,
      status: driver.status
    };

    console.log(`Successful login for driver: ${driver.email}`);
    res.status(200).json({
      success: true,
      token,
      data: driverData
    });

  } catch (err) {
    console.error('Login Controller Error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Driver Registration
export const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType, vehicleNumber } = req.body;

    // Validate Input
    if (!name || !email || !password || !phone || !vehicleType || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check for Existing Driver
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { phone }, { vehicleNumber }] 
    });
    
    if (existingDriver) {
      let conflictField = existingDriver.email === email ? 'email' : 
                        existingDriver.phone === phone ? 'phone' : 'vehicleNumber';
      return res.status(409).json({ 
        success: false, 
        message: `${conflictField} already registered` 
      });
    }

    // Create New Driver
    const driver = await Driver.create({
      name,
      email,
      password,
      phone,
      vehicleType,
      vehicleNumber
    });

    // Generate Token
    const token = generateToken(driver._id);

    // Prepare Response
    const driverData = {
      id: driver._id,
      name: driver.name,
      email: driver.email,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      status: driver.status
    };

    console.log(`New driver registered: ${driver.email}`);
    res.status(201).json({
      success: true,
      token,
      data: driverData
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get Driver Profile
export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      data: driver
    });
    
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile'
    });
  }
};
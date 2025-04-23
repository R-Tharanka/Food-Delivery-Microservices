import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import Restaurant from '../models/Restaurant.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


// Register a new restaurant (with admin email and password)
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { name, ownerName, location, contactNumber, email, password } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const existingRestaurant = await Restaurant.findOne({
      $or: [{ name }, { 'admin.email': email }],
    });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant or Email already exists' });
    }

    const newRestaurant = new Restaurant({
      name,
      ownerName,
      location,
      contactNumber,
      profilePicture,
      admin: { email, password },
    });

    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant and Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login restaurant admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ 'admin.email': email });
    if (!restaurant) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await restaurant.compareAdminPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).select('-admin.password');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update restaurant details
router.put('/update', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  const { name, ownerName, location, contactNumber } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Update fields if provided
    if (name) restaurant.name = name;
    if (ownerName) restaurant.ownerName = ownerName;
    if (location) restaurant.location = location;
    if (contactNumber) restaurant.contactNumber = contactNumber;

    // Update profile picture if a file is uploaded
    if (req.file) {
      restaurant.profilePicture = `/uploads/${req.file.filename}`;
    }

    await restaurant.save();
    res.status(200).json({ message: 'Profile updated successfully', restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update availability
router.put('/availability', authMiddleware, async (req, res) => {
  const { availability } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (typeof availability !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for availability. Must be true or false.' });
    }

    restaurant.availability = availability;
    await restaurant.save();

    res.status(200).json({ message: `Restaurant is now ${availability ? 'Open' : 'Closed'}`, availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

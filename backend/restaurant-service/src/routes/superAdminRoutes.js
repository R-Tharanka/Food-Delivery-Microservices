import express from 'express';
const router = express.Router();

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import SuperAdmin from '../models/SuperAdmin.js';
import { getAllRestaurants, getRestaurantById, deleteRestaurant, updateRestaurant } from '../controllers/superAdminController.js'; // Named imports
import authMiddleware from '../middleware/authMiddleware.js';

// Super Admin Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Super Admin already exists' });
    }

    const newSuperAdmin = new SuperAdmin({ name, email, password });
    await newSuperAdmin.save();

    res.status(201).json({ message: 'Super Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Super Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: 'superAdmin',  name: superAdmin.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ token, name: superAdmin.name });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Super Admin Routes for Managing Restaurants
router.get('/restaurants', authMiddleware, getAllRestaurants);
router.get('/restaurant/:id', authMiddleware, getRestaurantById);
router.delete('/restaurant/:id', authMiddleware, deleteRestaurant);
router.put('/restaurant/:id', authMiddleware, updateRestaurant);

export default router;

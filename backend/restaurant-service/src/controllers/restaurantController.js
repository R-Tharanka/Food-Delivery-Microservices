import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Restaurant from '../models/Restaurant.js';

// Login route for Restaurant Admin
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the restaurant by email (look for the admin inside the restaurant model)
    const restaurant = await Restaurant.findOne({ 'admin.email': email });

    // If the restaurant is not found, return an error
    if (!restaurant) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, restaurant.admin.password);

    // If the password doesn't match, return an error
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If login is successful, generate a JWT token
    const token = jwt.sign(
      { restaurantId: restaurant._id, email: restaurant.admin.email },
      process.env.JWT_SECRET, // Secret from environment variables
      { expiresIn: '30d' } // Token expires in 1 hour
    );

    // Send the token as a response
    return res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

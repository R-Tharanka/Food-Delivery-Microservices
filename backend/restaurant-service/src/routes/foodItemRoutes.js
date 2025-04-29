import express from 'express';
import FoodItem from '../models/FoodItem.js';
import Restaurant from '../models/Restaurant.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Create a new food item (Restaurant Admin only)
router.post('/create', authMiddleware,upload.single('image'), async (req, res) => {
  const { name, description, price, category } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const newFoodItem = new FoodItem({
      restaurant: restaurant._id,
      name,
      description,
      price,
      image: `/uploads/${req.file.filename}`,
      category,
    });

    await newFoodItem.save();
    res.status(201).json({ message: 'Food item created successfully', newFoodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all food items for a restaurant (Restaurant Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurant: req.user.id });
    res.status(200).json(foodItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a food item (Restaurant Admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, price, imageUrl, category, availability } = req.body;

  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (foodItem.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to modify this food item' });
    }

    if (name) foodItem.name = name;
    if (description) foodItem.description = description;
    if (price) foodItem.price = price;
    if (category) foodItem.category = category;
    if (typeof availability !== 'undefined') foodItem.availability = availability;

    if (req.file) {
      foodItem.image = `/uploads/${req.file.filename}`;
    }

    await foodItem.save();
    res.status(200).json({ message: 'Food item updated successfully', foodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a food item (Restaurant Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (foodItem.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this food item' });
    }

    await foodItem.deleteOne();
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update food item availability (Restaurant Admin only)
router.put('/availability/:id', authMiddleware, async (req, res) => {
  const { availability } = req.body;

  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (foodItem.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to modify this food item' });
    }

    if (typeof availability !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for availability. Must be true or false.' });
    }

    foodItem.availability = availability;
    await foodItem.save();

    res.status(200).json({ message: `Food item is now ${availability ? 'Available' : 'Unavailable'}`, foodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all food items (Public)
router.get('/all', async (req, res) => {
  try {
    const foodItems = await FoodItem.find().populate('restaurant', 'name location'); // Populate restaurant details if needed
    res.status(200).json(foodItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get food items by restaurant (Public)
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find food items for the given restaurant ID
    const foodItems = await FoodItem.find({ restaurant: restaurantId }).populate('restaurant', 'name location');

    if (!foodItems.length) {
      return res.status(404).json({ message: 'No food items found for this restaurant' });
    }

    res.status(200).json(foodItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

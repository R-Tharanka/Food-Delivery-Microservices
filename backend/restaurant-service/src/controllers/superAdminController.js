import Restaurant from '../models/Restaurant.js';

// Get all restaurants (Super Admin only)
export const getAllRestaurants = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Access denied, only Super Admin can access this resource' });
    }

    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a specific restaurant by ID (Super Admin only)
export const getRestaurantById = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Access denied, only Super Admin can access this resource' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a restaurant (Super Admin only)
export const deleteRestaurant = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Access denied, only Super Admin can access this resource' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Delete associated food items here (if needed)
    // await FoodItem.deleteMany({ restaurant: restaurant._id });

    await restaurant.deleteOne();
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update restaurant details (Super Admin only)
export const updateRestaurant = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Access denied, only Super Admin can update restaurants' });
    }

    const { id } = req.params;
    const updates = req.body; // Get updated details from request body

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

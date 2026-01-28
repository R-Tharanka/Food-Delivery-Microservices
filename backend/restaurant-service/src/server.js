import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import restaurantRoutes from './routes/restaurantRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import foodItemRoutes from './routes/foodItemRoutes.js';
import cors from 'cors';


const app = express();

app.use(cors());
// Middleware to parse JSON data
app.use(express.json());



// Routes
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('Restaurant Service Running...');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    stack: error.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



/*hotelAdmin
rifky@gmail.com
password@123

super admin 
shakir077@gmail.com
password123  */

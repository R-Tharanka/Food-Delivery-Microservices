require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

// Connect DB then start
connectDB().then(() => {
  app.use('/api/auth', authRoutes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on port ${PORT}`);
  });
});

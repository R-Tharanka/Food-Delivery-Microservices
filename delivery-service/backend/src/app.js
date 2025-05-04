import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config();
connectDB();

const app = express();  // Define app before using it
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/delivery", deliveryRoutes);

export default app;

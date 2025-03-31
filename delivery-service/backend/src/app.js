import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();  // Define app before using it
app.use(cors());
app.use(express.json());

app.use("/api/delivery", deliveryRoutes);
app.use("/api/auth", authRoutes);

export default app;

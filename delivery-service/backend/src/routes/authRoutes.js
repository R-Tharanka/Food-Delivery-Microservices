import express from "express";
import { registerDriver, loginDriver } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const driver = await registerDriver(name, email, password, phone); // Now returns user details only
    res.status(201).json({
      message: "Driver registered successfully",
      driver
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginDriver(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

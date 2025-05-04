import express from "express";

import { registerDriver, loginDriver } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);

export default router;
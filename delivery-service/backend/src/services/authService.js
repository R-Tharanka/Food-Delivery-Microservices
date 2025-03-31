import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Driver from "../models/Driver.js";
import dotenv from "dotenv";

dotenv.config();

 const registerDriver = async (name, email, password, phone) => {
  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) {
    throw new Error("Driver already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDriver = new Driver({ name, email, password: hashedPassword, phone });
  await newDriver.save();

  return { name: newDriver.name, email: newDriver.email, phone: newDriver.phone };
};

const loginDriver = async (email, password) => {
  const driver = await Driver.findOne({ email });
  if (!driver) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, driver.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return generateToken(driver._id);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export { registerDriver, loginDriver };

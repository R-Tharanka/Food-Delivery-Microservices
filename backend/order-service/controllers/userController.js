import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Function to generate JWT Token with role included
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role, // ✅ Ensure role is included
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body; // Include role from request

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "customer", // Default to "customer" if not provided
        });

        if (user) {
            res.status(201).json({
                message: "User registered successfully!",
                token: generateToken(user), // Generate token with role
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Authenticate user & get token
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // ✅ Include role in response
                token: generateToken(user), // ✅ Pass entire user object, not just _id
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { registerUser, loginUser };

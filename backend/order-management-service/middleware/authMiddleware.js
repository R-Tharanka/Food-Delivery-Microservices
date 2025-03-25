import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying JWT
const protect = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.role) {
            return res.status(401).json({ message: "Invalid token: Role not found" });
        }

        req.user = decoded; // Attach decoded user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to check for specific roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Access denied: Role not found" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Unauthorized role" });
        }

        next(); // Proceed if role matches
    };
};

export { protect, authorizeRoles };

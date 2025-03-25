import express from "express";
import dotenv from "dotenv";
import http from "http"; // Needed for WebSockets
import { Server } from "socket.io"; // Import Socket.io
import connectDB from "./config/db.js";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow frontend connections
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);


// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    // Listen for order status updates
    socket.on("orderStatusUpdate", (data) => {
        console.log("Order Update:", data);
        io.emit("updateOrder", data); // Broadcast update to all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());

// Test Route
app.get("/", (req, res) => res.send("Payment Service Running"));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🚀 Payment Service running on port ${PORT}`));


const Payment = require("./models/PaymentModel"); // Import Model

app.get("/test-payment", async (req, res) => {
    try {
        const testPayment = new Payment({
            orderId: "123456",
            userId: "987654",
            amount: 50,
            currency: "usd",
            status: "Pending",
        });

        await testPayment.save();
        res.json({ message: "Test payment saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

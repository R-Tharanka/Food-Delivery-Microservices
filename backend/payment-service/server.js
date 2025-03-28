require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS for your frontend
app.use(cors({ origin: "http://localhost:3000" }));

// Webhook route (must receive raw body)
app.use("/api/payment/webhook", webhookRoutes);

// JSON parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Service API",
      version: "1.0.0",
      description: "API documentation for Payment Microservice (Stripe Integration)",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define API routes
app.use("/api/payment", paymentRoutes);

// Test Route
app.get("/", (req, res) => res.send("Payment Service Running"));

// Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service running on port ${PORT}`);
  console.log(`🌍 API Base URL: http://localhost:${PORT}`);
  console.log(`📖 Swagger API Docs: http://localhost:${PORT}/api-docs`);
});

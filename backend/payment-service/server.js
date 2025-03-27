require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Use JSON parser for all non-webhook routes
app.use(express.json());

// For webhook endpoint, we need raw body. (Our webhook route already uses express.raw.)
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
app.use("/api/payment/webhook", webhookRoutes);

// Test Route
app.get("/", (req, res) => res.send("Payment Service Running"));

// Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service running on port ${PORT}`);
  console.log(`🌍 API Base URL: http://localhost:${PORT}`);
  console.log(`📖 Swagger API Docs: http://localhost:${PORT}/api-docs`);
});

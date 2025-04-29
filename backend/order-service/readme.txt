# Order Service

The Order Service is a microservice in the Food Delivery Microservices project. It is responsible for managing orders, including creating, updating, retrieving, and canceling orders. It also supports WebSocket connections for real-time order status updates.

---

## Features

1. **Order Management**:
    - Create new orders.
    - Retrieve all orders or a specific order by ID.
    - Update order details (e.g., items, delivery address).
    - Update order status (e.g., Pending, Confirmed, Delivered).
    - Cancel orders.

2. **Authentication & Authorization**:
    - JWT-based authentication for secure access.
    - Role-based access control (RBAC) for customers and restaurant admins.

3. **Real-Time Updates**:
    - WebSocket integration for broadcasting order status updates.

4. **Database**:
    - MongoDB for storing order details.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time Communication**: Socket.IO
- **Environment Management**: dotenv

---

## API Endpoints

### Order Endpoints

- **POST** `/api/orders`:
  - Create a new order (Customer only).
  - Request body:
    ```json
    {
      "customerId": "12345",
      "restaurantId": "67890",
      "items": [
        { "foodId": "abc123", "quantity": 2, "price": 10.5 }
      ],
      "deliveryAddress": "123 Main St, City, Country"
    }
    ```

- **GET** `/api/orders`:
  - Retrieve all orders (Customer and Restaurant Admin only).

- **GET** `/api/orders/:id`:
  - Retrieve a specific order by ID (Customer and Restaurant Admin only).

- **PATCH** `/api/orders/:id`:
  - Update order details (Customer only).
  - Request body:
    ```json
    {
      "items": [
        { "foodId": "abc123", "quantity": 3, "price": 10.5 }
      ],
      "deliveryAddress": "456 Another St, City, Country"
    }
    ```

- **PATCH** `/api/orders/:id`:
  - Update order status (Restaurant Admin only).
  - Request body:
    ```json
    {
      "status": "Confirmed"
    }
    ```

- **DELETE** `/api/orders/:id`:
  - Cancel an order (Customer only).

---

## WebSocket Events

- **orderStatusUpdate**:
  - Broadcasts real-time updates for order status changes.
  - Example payload:
    ```json
    {
      "orderId": "12345",
      "status": "Out for Delivery"
    }
    ```

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/R-Tharanka/Food-Delivery-Microservices.git
    cd backend/order-service
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure the following environment variables:
    ```properties
    PORT=5005
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

4. Start the service:
    ```bash
    npm start
    ```

---

## Folder Structure

```
backend/order-service/
├── config/             # Database configuration
├── controllers/        # Business logic for routes
├── middleware/         # Authentication and authorization middleware
├── models/             # Mongoose models for MongoDB
├── routes/             # API route definitions
├── index.js            # Entry point for the service
├── readme.txt          # Documentation for the service
```

---

## Notes

- Ensure MongoDB is running and accessible via the `MONGO_URI` provided in the `.env` file.
- Use Postman or similar tools to test the API endpoints.
- WebSocket connections are available for real-time updates.
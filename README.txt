# Food Delivery Microservices

A cloud-native food ordering and delivery platform built using the MERN stack with a microservices architecture. This project is designed to provide a seamless experience for customers, restaurant admins, and delivery personnel.

---

## Features

### Customer Features
- **Browse Restaurants and Food Items**: View available restaurants and their food menus.
- **Add to Cart**: Add food items to the shopping cart.
- **Place Orders**: Create new orders and manage them.
- **Order Details**: View detailed information about placed orders.
- **Download Order Details**: Generate and download order details as a PDF.
- **Cart Management**: Manage items in the shopping cart.

### Restaurant Admin Features
- **Login and Dashboard**: Manage restaurant details and food items.
- **Food Item Management**: Add, update, or delete food items.
- **Order Management**: View and update order statuses.

### Delivery Features
- **Driver Registration and Login**: Secure authentication for drivers.
- **Dashboard**: View and manage assigned deliveries.
- **Delivery Creation**: Create new delivery orders.
- **Delivery Details**: View detailed information about a specific delivery.
- **Real-time Tracking**: Track driver location and delivery progress on a map.
- **Driver Simulator**: Simulate driver movement for testing purposes.

### Payment Features
- **Payment Processing**: Secure payments using Stripe.
- **Notifications**: SMS and email notifications for payment status updates.
- **Webhooks**: Stripe webhook integration for real-time payment updates.

---

## Tech Stack

- **Frontend**: React, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time Communication**: Socket.IO
- **Payment Integration**: Stripe
- **Notifications**: Twilio (SMS), Resend (Email)
- **DevOps**: Docker, Kubernetes
- **API Documentation**: Swagger (OpenAPI)

---

## Microservices Overview

### 1. **Restaurant Service**
- Manages restaurant registration, login, profile updates, and food item management.
- **Endpoints**:
    - `/api/restaurant/register`: Register a new restaurant.
    - `/api/restaurant/login`: Login for restaurant admins.
    - `/api/food-items/create`: Add a new food item.
    - `/api/food-items/:id`: Update or delete a food item.

### 2. **Order Service**
- Handles order creation, updates, retrieval, and cancellation.
- **Endpoints**:
    - `/api/orders`: Create or retrieve orders.
    - `/api/orders/:id`: Update or delete a specific order.
- **WebSocket Events**:
    - `orderStatusUpdate`: Broadcasts real-time order status updates.

### 3. **Payment Service**
- Processes payments using Stripe and sends notifications.
- **Endpoints**:
    - `/api/payment/process`: Create or retrieve a payment.
    - `/api/payment/webhook`: Listen to Stripe webhook events.
- **Notifications**:
    - SMS via Twilio.
    - Email via Resend.

### 4. **Delivery Service**
- Manages delivery assignments and real-time tracking.
- **Endpoints**:
    - `/api/delivery/create`: Create a new delivery.
    - `/api/delivery/:id`: Update or delete a delivery.
- **WebSocket Events**:
    - `location-update`: Send live location updates for a delivery.

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Docker (optional for containerization)
- Kubernetes (optional for orchestration)

### Clone the Repository
```bash
git clone https://github.com/R-Tharanka/Food-Delivery-Microservices.git
cd Food-Delivery-Microservices
```

### Backend Services
1. Navigate to the respective service directory (e.g., `backend/auth-service`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of each service and configure the required environment variables (refer to the service-specific README files for details).
4. Start the service:
   ```bash
   npm run dev
   ```

### Frontend Service
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and configure the following:
   ```properties
   REACT_APP_BACKEND_URL=http://localhost:5005
   REACT_APP_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## API Endpoints

### Auth Service
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in a user.

### Order Service
- **POST** `/api/orders`: Create a new order.
- **GET** `/api/orders`: Retrieve all orders.
- **PATCH** `/api/orders/:id`: Update order details or status.
- **DELETE** `/api/orders/:id`: Cancel an order.

### Payment Service
- **POST** `/api/payment/process`: Create or retrieve a payment.
- **POST** `/api/payment/webhook`: Handle Stripe webhook events.

### Restaurant Service
- **POST** `/api/restaurant/register`: Register a new restaurant.
- **POST** `/api/restaurant/login`: Log in a restaurant admin.
- **POST** `/api/food-items/create`: Add a new food item.

### Delivery Service
- **POST** `/api/delivery/create`: Create a new delivery.
- **GET** `/api/delivery`: Retrieve deliveries for a driver.
- **PUT** `/api/delivery/:id/status`: Update delivery status.

---

## Real-Time Features

- **Order Status Updates**: WebSocket integration for broadcasting order status changes.
- **Driver Location Updates**: Real-time tracking of driver locations.

---

## Deployment

### Docker
1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

### Kubernetes
1. Apply the Kubernetes manifests for each service:
   ```bash
   kubectl apply -f backend/<service-name>/k8s/
   ```

---

## Testing

### Backend
- Run tests using Jest:
  ```bash
  npm test
  ```

### Frontend
- Run tests using React Testing Library:
  ```bash
  npm test
  ```

---

## Notes

- Ensure MongoDB is running and accessible for all backend services.
- Replace sensitive information in `.env` files with your own values.
- Use Stripe test cards for payment testing.

---

## License

This project is licensed under the ISC License.



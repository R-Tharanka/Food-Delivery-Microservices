# Food Delivery Microservices

A cloud-native food ordering & delivery platform using the MERN stack with a microservices architecture.

## Features
- User Authentication (JWT)
- Restaurant Management
- Order Processing
- Delivery Tracking
- Payment Integration
- Notifications (SMS/Email)

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React, Redux
- **DevOps:** Docker, Kubernetes
- **Authentication & Security:** JWT, bcrypt, Role-Based Access Control (RBAC)
- **API Documentation:** Swagger (OpenAPI)
- **Messaging & Notifications:** Twilio (SMS), Nodemailer (Email)

---

## Setup Instructions

### **1. Clone the Repository**

```sh
git clone https://github.com/YOUR-USERNAME/Food-Delivery-Microservices.git
cd Food-Delivery-Microservices

```
### **2. Install dependencies for each microservice**
  Each microservice is an independent Node.js application, so you need to install dependencies separately.

```
cd backend/service_name
npm install
```

### **3. Configure Environment Variables**
Each microservice requires a .env file. Create one inside each service directory:

Example .env for auth-service:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/authDB
JWT_SECRET=your_secret_key

```
Ensure that you create a .env file for each microservice and configure them properly.

### **4.Run Each Microservice**

Start the authentication service:

```
cd backend/auth-service
npm start

```
Do the same for other services (order-service, restaurant-service, etc.).

### **5. Run the Frontend

```
cd frontend
npm install
npm start
```



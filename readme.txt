SkyDish – Food Delivery Microservices

A cloud‐native, microservices‐based food ordering & delivery platform.
Supports four roles: Customer, Restaurant Admin, Delivery Personnel, Super Admin.

Table of Contents
Overview
Tech Stack
Prerequisites
Repository Layout
Environment Variables
Running Locally with Docker Compose
Running on Kubernetes
Microservices & Endpoints
Frontend Setup
Testing & Linting
Troubleshooting Tips
Demo & Submission

1. Overview
Customers can browse restaurants, add to cart, place orders, and track deliveries.
Restaurant Admins manage their menus, view and update orders.
Delivery Personnel accept assignments, update statuses, and share real‐time location.
Super Admin oversees all users and restaurants.
Microservices:
Auth Service (Port 4000)
Restaurant Service (Port 5002)
Order Service (Port 5005)
Delivery Service (Port 5003)
Payment Service (Port 5004)
Frontend (Port 3000)

2. Tech Stack
Frontend: React, React Router, Axios, Tailwind/CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas (Mongoose)
Auth: JWT & bcrypt
Realtime: Socket.IO
Payments: Stripe
Notifications: Twilio (SMS), Resend (Email)
Containerization: Docker Compose
Orchestration: Kubernetes (YAML manifests)
API Docs: Swagger (Payment Service)

3. Prerequisites
Node.js v14+ & npm
Docker & docker-compose
Kubernetes & kubectl (for local cluster)
MongoDB URI (Atlas or self‐hosted)
API keys for:
JWT_SECRET
STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
RESEND_API_KEY

4. Repository Layout
/  
├── backend/  
│   ├── auth-service/  
│   ├── restaurant-service/  
│   ├── order-service/  
│   ├── delivery-service/  
│   └── payment-service/  
├── frontend/  
│   └── src/  
├── k8s/               # Kubernetes manifests (secrets, deployments, services)  
├── docker-compose.yml  
├── readme.txt          # ← this file  
├── submission.txt      # GitHub & demo links  
└── members.txt         # Team member details  

5. Environment Variables
Create a .env file in the project root with:
# MongoDB (shared)
MONGO_URI=<your_mongo_uri>

# Auth Service (4000)
AUTH_PORT=4000
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d

# Restaurant Service (5002)
REST_PORT=5002

# Order Service (5005)
ORDER_PORT=5005

# Delivery Service (5003)
DELIVERY_PORT=5003

# Payment Service (5004)
PAY_PORT=5004
STRIPE_SECRET_KEY=<sk_test_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>
TWILIO_ACCOUNT_SID=<AC...>
TWILIO_AUTH_TOKEN=<...>
TWILIO_PHONE_NUMBER=<+...>
RESEND_API_KEY=<re_...>
And in frontend/.env:
REACT_APP_BACKEND_URL=http://localhost:4000
REACT_APP_STRIPE_PUBLISHABLE_KEY=<pk_test_...>

6. Running Locally with Docker Compose
From repo root:
docker-compose up --build
MongoDB container → mongodb://mongo:27017
Services available on ports 4000, 5002, 5003, 5004, 5005
Frontend → http://localhost:3000

7. Running on Kubernetes
Ensure your local cluster is running (e.g., Docker Desktop).
Apply secrets & manifests:
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
Verify pods/services:
kubectl get pods
kubectl get svc

8. Microservices & Endpoints

8.1 Auth Service (http://localhost:4000)
POST /api/auth/register/customer
POST /api/auth/login
GET /api/auth/customer/me (JWT protect)
PATCH /api/auth/customer/me
8.2 Restaurant Service (:5002)
POST /api/restaurant/register
POST /api/restaurant/login
GET /api/restaurant/profile
PUT /api/restaurant/update
Food Items:
POST /api/food-items/create
GET /api/food-items/all
PUT /api/food-items/:id
DELETE /api/food-items/:id
8.3 Order Service (:5005)
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/orders/:id
DELETE /api/orders/:id
WebSocket event: orderStatusUpdate
8.4 Delivery Service (:5003)
POST /api/delivery/create
GET /api/delivery
GET /api/delivery/:id
PUT /api/delivery/:id/status
WebSocket event: location-update
8.5 Payment Service (:5004)
POST /api/payment/process
GET /api/payment/status/:orderId
POST /api/payment/webhook (Stripe webhook)
Swagger UI: http://localhost:5004/api-docs

9. Frontend Setup
cd frontend
npm install
npm start
Visit http://localhost:3000.
Login/Register pages under /auth/login and /auth/register.

10. Testing & Linting
Backend (in each backend/* folder):
npm test
npm run lint
Frontend:
cd frontend
npm test

11. Troubleshooting Tips
CORS errors: Ensure each service uses:
app.use(cors({ origin: "http://localhost:3000" }));
MongoDB connectivity: Whitelist 0.0.0.0/0 in Atlas for development.
Stripe webhooks (local):
stripe listen --forward-to localhost:5004/api/payment/webhook
12. Demo & Submission
GitHub Repo: https://github.com/R-Tharanka/Food-Delivery-Microservices.git
Demo Video: https://youtu.be/YourDemoLink
Members: See members.txt

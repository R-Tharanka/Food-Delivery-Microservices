# Restaurant Service

The Restaurant Service is a microservice in the Food Delivery Microservices project. It is responsible for managing restaurant-related operations, including restaurant registration, login, profile management, food item management, and availability updates.

---

## Features

1. **Restaurant Management**:
    - Register new restaurants with admin credentials.
    - Login for restaurant admins.
    - Update restaurant profiles, including profile pictures.
    - Manage restaurant availability (open/closed).

2. **Food Item Management**:
    - Add, update, and delete food items.
    - Manage food item availability.
    - Retrieve all food items for a specific restaurant.

3. **Super Admin Management**:
    - Super Admin registration and login.
    - Manage restaurants (view, update, delete).

4. **Authentication & Authorization**:
    - JWT-based authentication for restaurant admins and super admins.
    - Role-based access control (RBAC) for secure operations.

5. **File Uploads**:
    - Upload and store profile pictures and food item images.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Environment Management**: dotenv

---

## API Endpoints

### Restaurant Admin Endpoints
- **POST** `/api/restaurant/register`: Register a new restaurant.
- **POST** `/api/restaurant/login`: Login for restaurant admins.
- **GET** `/api/restaurant/profile`: Get restaurant profile details.
- **PUT** `/api/restaurant/update`: Update restaurant profile.
- **PUT** `/api/restaurant/availability`: Update restaurant availability.

### Food Item Endpoints
- **POST** `/api/food-items/create`: Add a new food item.
- **GET** `/api/food-items`: Get all food items for a restaurant.
- **PUT** `/api/food-items/:id`: Update a food item.
- **DELETE** `/api/food-items/:id`: Delete a food item.
- **PUT** `/api/food-items/availability/:id`: Update food item availability.
- **GET** `/api/food-items/all`: Get all food items (public).
- **GET** `/api/food-items/restaurant/:restaurantId`: Get food items by restaurant (public).

### Super Admin Endpoints
- **POST** `/api/superAdmin/register`: Register a new super admin.
- **POST** `/api/superAdmin/login`: Login for super admins.
- **GET** `/api/superAdmin/restaurants`: Get all restaurants.
- **GET** `/api/superAdmin/restaurant/:id`: Get a specific restaurant by ID.
- **PUT** `/api/superAdmin/restaurant/:id`: Update restaurant details.
- **DELETE** `/api/superAdmin/restaurant/:id`: Delete a restaurant.

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/R-Tharanka/Food-Delivery-Microservices.git
    cd backend/restaurant-service
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure the following:
    ```properties
    PORT=5002
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

4. Start the service:
    ```bash
    npm run dev
    ```

---

## Folder Structure

```
backend/restaurant-service/
├── src/
│   ├── controllers/       # Business logic for routes
│   ├── middleware/        # Middleware for authentication, file uploads, etc.
│   ├── models/            # Mongoose models for MongoDB
│   ├── routes/            # API route definitions
│   ├── server.js          # Entry point for the service
├── uploads/               # Directory for uploaded images
├── .env                   # Environment variables
├── package.json           # Node.js dependencies and scripts
└── readme.txt             # Documentation for the service
```

---

## Environment Variables

- `PORT`: The port on which the service runs (default: 5002).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.

---

## Notes

- Ensure MongoDB is running and accessible via the `MONGO_URI` provided in the `.env` file.
- Uploaded images are stored in the `uploads/` directory.
- Use Postman or similar tools to test the API endpoints.
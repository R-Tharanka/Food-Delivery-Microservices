# Food-Delivery-Microservices

## Backend Service

The backend service is responsible for handling the core functionalities of the delivery management system. It is built using Node.js, Express.js, and MongoDB.

### Features
- **Authentication**: Driver registration and login using JWT.
- **Delivery Management**: Create, update, delete, and fetch delivery details.
- **Driver Assignment**: Assign the nearest available driver to a delivery.
- **Real-time Updates**: WebSocket integration for live location updates.
- **Geocoding**: Convert addresses to geographical coordinates using OpenCage API.

### Project Structure
```
backend/
  src/
    app.js                # Express app setup
    server.js             # Server and WebSocket setup
    config/
      db.js              # MongoDB connection setup
    controllers/
      authController.js  # Authentication logic
      deliveryController.js # Delivery management logic
    middleware/
      authMiddleware.js  # JWT authentication middleware
    models/
      Driver.js          # Driver schema and model
      Delivery.js        # Delivery schema and model
    routes/
      authRoutes.js      # Authentication routes
      deliveryRoutes.js  # Delivery management routes
    services/
      assignDriverService.js # Driver assignment logic
    utils/
      geocode.js         # Geocoding utility
      socket.js          # WebSocket utility
```

### Environment Variables
The backend requires the following environment variables to be set in a `.env` file:

```
PORT=5003
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

### Installation
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
- To start the server in development mode:
  ```bash
  npm run dev
  ```
- To start the server in production mode:
  ```bash
  npm start
  ```

### API Endpoints
#### Authentication
- **POST** `/api/auth/register`: Register a new driver.
- **POST** `/api/auth/login`: Login for drivers.

#### Delivery Management
- **POST** `/api/delivery/create`: Create a new delivery.
- **GET** `/api/delivery`: Get all deliveries for the logged-in driver.
- **GET** `/api/delivery/:id`: Get details of a specific delivery.
- **PUT** `/api/delivery/:id/status`: Update the status of a delivery.
- **DELETE** `/api/delivery/:id`: Delete a delivery (only if delivered).
- **GET** `/api/delivery/order/:orderId`: Get delivery details by order ID.

### WebSocket Events
- **join-driver-room**: Join a WebSocket room for a specific driver.
- **location-update**: Send live location updates for a delivery.

### Geocoding
The backend uses the OpenCage API for geocoding. Ensure you have a valid API key set in the `geocode.js` file.

### Dependencies
- **Core**:
  - express
  - mongoose
  - dotenv
  - cors
  - socket.io
  - bcrypt
  - jsonwebtoken
  - node-fetch
- **Dev**:
  - nodemon
  - eslint

### Notes
- Ensure MongoDB is running and accessible.
- Replace sensitive information like `MONGO_URI` and `JWT_SECRET` with your own values.
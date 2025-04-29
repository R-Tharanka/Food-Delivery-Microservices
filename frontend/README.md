# Food-Delivery-Microservices

## Frontend Service

The frontend service is a React-based web application that provides an interface for customers, restaurant admins, and delivery personnel to manage their respective tasks. It includes features such as user authentication, order management, food item browsing, cart management, and real-time updates.

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

### Delivery Features
- **Driver Registration and Login**: Secure authentication for drivers.
- **Dashboard**: View and manage assigned deliveries.
- **Delivery Creation**: Create new delivery orders.
- **Delivery Details**: View detailed information about a specific delivery.
- **Real-time Tracking**: Track driver location and delivery progress on a map.
- **Driver Simulator**: Simulate driver movement for testing purposes.

---

## Project Structure

```
frontend/
  src/
    App.js                # Main application component
    App.css               # Global styles
    index.js              # Application entry point
    index.css             # Global CSS
    pages/                # Page components
      customer/           # Customer-related pages
        foodItemList.js   # Food browsing page
        AddToCartPage.js  # Cart management page
        customerHome.js   # Customer dashboard
      orderManagement/    # Order management pages
        OrderHome.js      # Order dashboard
        Orders.js         # List of orders
        OrderForm.js      # Form for creating orders
      payment/            # Payment-related pages
        Checkout.js       # Checkout page
      restaurant/         # Restaurant admin pages
        components/
          RestaurantRegister.js  # Restaurant registration
          RestaurantLogin.js     # Restaurant login
        pages/
          RestaurantDashboard.js # Restaurant admin dashboard
      delivery/           # Delivery-related pages
        DriverDashboard.js       # Dashboard for managing deliveries
        CreateDelivery.js        # Page for creating deliveries
        DeliveryDetails.js       # Page for viewing delivery details
        MapTrackOrder.js         # Map-based delivery tracking
        DriverSimulator.js       # Simulate driver movement
        DriverSocketDashboard.js # WebSocket testing dashboard
    components/           # Reusable components
      OrderDetails.js     # Component for viewing order details
      UpdateOrder.js      # Component for updating orders
      DeleteOrder.js      # Component for deleting orders
    assets/               # Static assets (images, icons, etc.)
  public/
    index.html            # HTML template
    manifest.json         # Web app manifest
    robots.txt            # Robots exclusion file
```

---

## Environment Variables

The frontend requires the following environment variables to be set in a `.env` file:

```
REACT_APP_BACKEND_URL=http://localhost:5005
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
```

---

## Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

- To start the development server:
  ```bash
  npm start
  ```
- To build the application for production:
  ```bash
  npm run build
  ```

---

## Key Pages and Components

### Authentication
- **Register**: `/auth/register` - User registration page.
- **Login**: `/auth/login` - User login page.

### Customer Features
- **Food Browsing**: `/customer/restaurant/:restaurantId/foods` - View available food items.
- **Cart Management**: `/customer/cart` - Manage items in the cart.
- **Order Management**:
    ### Customer Features
    - **Order Dashboard**: `/orders` - View all orders.
    - **Order Details**: `/orders/details/:id` - View details of a specific order.
    - **Create Order**: `/orders/new` - Place a new order.
    - **Edit Order**: `/orders/edit/:id` - Update an existing order.
    - **Delete Order**: `/orders/delete/:id` - Cancel an order.

    ### Restaurant Admin Features
    - **Dashboard**: `/restaurant/dashboard` - Manage restaurant details and orders.

    ### Delivery Features
    - **Driver Dashboard**: `/delivery/dashboard` - Manage deliveries.
    - **Create Delivery**: `/delivery/create` - Create a new delivery order.
    - **Delivery Details**: `/delivery/:id` - View delivery details.
    - **Map Tracking**: `/delivery/map-track/:orderId` - Track delivery progress.

    ### Payment Features
    - **Checkout**: `/checkout` - Secure payment page using Stripe.
    - **Environment Variables**:
        - `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe key for payments.
        - `REACT_APP_BACKEND_URL`: Backend API base URL.
    - **Notes**: Use Stripe test cards for development.

---

## Dependencies

- **Core**:
  - react
  - react-dom
  - react-router-dom
  - axios
  - socket.io-client
  - react-bootstrap
  - jspdf
  - @stripe/react-stripe-js
  - @stripe/stripe-js
- **Dev**:
  - react-scripts
  - @testing-library/react
  - @testing-library/jest-dom

---

## Notes

- Ensure the backend services are running on `http://localhost:5005`.
- Replace sensitive information like `REACT_APP_BACKEND_URL` and `REACT_APP_STRIPE_PUBLISHABLE_KEY` with your own values.
# Payment Service

The Payment Service is a microservice for handling payment processing, notifications, and webhook integration for the Food Delivery Microservices project. It integrates with Stripe for payment processing, Twilio for SMS notifications, and Resend for email notifications.

---

## Features

1. **Payment Processing**:
  - Handles payment creation and status updates using Stripe.
  - Supports multiple currencies (default: USD).

2. **Notifications**:
  - Sends SMS notifications using Twilio.
  - Sends email notifications using Resend.

3. **Webhooks**:
  - Listens to Stripe webhooks for payment status updates (e.g., `payment_intent.succeeded`, `payment_intent.payment_failed`).

4. **API Documentation**:
  - Swagger API documentation available at `/api-docs`.

5. **Kubernetes Deployment**:
  - Includes Kubernetes manifests for deployment, service, and secrets.

---

## Installation

1. Clone the repository:
  ```bash
  git clone <repository-url>
  cd backend/payment-service
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory and configure the following environment variables:
  ```plaintext
  PORT=5004
  MONGO_URI=<your_mongo_connection_string>
  STRIPE_SECRET_KEY=<your_stripe_secret_key>
  STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
  TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
  TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
  TWILIO_PHONE_NUMBER=<your_twilio_phone_number>
  RESEND_API_KEY=<your_resend_api_key>
  ```

---

## Usage

### Start the Service
- Development mode:
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

### Docker
1. Build and run the Docker container:
  ```bash
  docker-compose up --build
  ```

2. Access the service at:
  ```
  http://localhost:5004
  ```

### Kubernetes
1. Apply the Kubernetes manifests:
  ```bash
  kubectl apply -f k8s/
  ```

2. Access the service via the LoadBalancer or NodePort.

---

## API Endpoints

### Payment Routes (`/api/payment`)
1. **POST `/process`**:
  - Creates a new payment or retrieves an existing one.
  - Request body:
    ```json
    {
     "orderId": "12345",
     "userId": "67890",
     "amount": 50.00,
     "currency": "usd",
     "email": "customer@example.com",
     "phone": "+1234567890"
    }
    ```

### Webhook Routes (`/api/payment/webhook`)
1. **POST `/`**:
  - Listens to Stripe webhook events and updates payment status in the database.
  - Automatically sends SMS and email notifications based on the payment status.

---

## Models

### Payment Model
The `PaymentModel.js` defines the schema for storing payment details in MongoDB:
- `orderId`: Unique identifier for the order.
- `userId`: Identifier for the user.
- `amount`: Payment amount.
- `currency`: Payment currency (default: USD).
- `status`: Payment status (`Pending`, `Paid`, `Failed`).
- `email`: Customer's email address.
- `phone`: Customer's phone number.
- `stripePaymentIntentId`: Stripe PaymentIntent ID.
- `stripeClientSecret`: Stripe client secret for frontend use.
- `createdAt`: Timestamp for record creation.
- `updatedAt`: Timestamp for record updates.

---

## Notifications

### SMS Notifications
- Implemented in `twilioService.js`.
- Sends SMS to the customer's phone number upon successful or failed payment.

### Email Notifications
- Implemented in `emailService.js`.
- Sends email to the customer's email address upon successful or failed payment.

---

## Development

### Testing
- Run tests using Jest:
  ```bash
  npm test
  ```

### Linting
- Use ESLint for code quality checks.

---

## API Documentation
- Swagger documentation is available at:
  ```
  http://localhost:5004/api-docs
  ```

---

## Kubernetes Manifests

### Deployment (`k8s/deployment.yaml`)
- Deploys the payment service with 2 replicas.
- Uses environment variables from Kubernetes secrets.

### Service (`k8s/service.yaml`)
- Exposes the payment service via a LoadBalancer.

### Secrets (`k8s/secrets.yaml`)
- Stores sensitive environment variables like API keys and database URIs.

---

## Folder Structure

```
backend/payment-service/
├── config/             # Database configuration
├── k8s/               # Kubernetes manifests for deployment
├── models/            # Mongoose models for MongoDB
├── routes/            # API route definitions
├── utils/             # Utility functions (e.g., Twilio, email services)
├── __tests__/         # Unit and integration tests
├── server.js          # Entry point for the service
├── readme.txt         # Documentation for the service
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── test-card-details.md # Test card details for Stripe
├── webhook-guide.md   # Guide for setting up Stripe webhooks
```

---

## Dependencies

- **Core**:
  - `express`: Web framework.
  - `mongoose`: MongoDB object modeling.
  - `stripe`: Payment processing.
  - `twilio`: SMS notifications.
  - `resend`: Email notifications.

- **Dev**:
  - `jest`: Testing framework.
  - `nodemon`: Development server.

---

## License
This project is licensed under the ISC License.

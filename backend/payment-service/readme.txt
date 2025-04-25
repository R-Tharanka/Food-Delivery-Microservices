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

---

## Installation

1. Clone the repository.
2. Navigate to the `payment-service` directory.
3. Install dependencies:
    ```
    npm install
    ```

4. Create a `.env` file in the root directory and configure the following environment variables:
    ```
    PORT=5004
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
  ```
  npm run dev
  ```
- Production mode:
  ```
  npm start
  ```

### API Endpoints

#### Payment Routes (`/api/payment`)
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

#### Webhook Routes (`/api/payment/webhook`)
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
  ```
  npm test
  ```

### Linting
- Use ESLint for code quality checks.

---

## API Documentation
- Swagger documentation is available at:
  ```
  http://localhost:<PORT>/api-docs
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
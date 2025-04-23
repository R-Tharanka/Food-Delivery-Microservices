## Authenticate Stripe CLI  
Before listening for webhooks, you need to log in:  

```sh
stripe login
```
## Listen for Webhooks Locally
Run the following command to start listening for events:

```sh
stripe listen --forward-to http://localhost:5004/api/payment/webhook
```
## Trigger a Test Webhook
To test if your webhook is working, trigger a test event. For example, to simulate a successful payment:

```sh
stripe trigger payment_intent.succeeded
```
You can also trigger other events, such as:

```sh
stripe trigger payment_intent.payment_failed
``
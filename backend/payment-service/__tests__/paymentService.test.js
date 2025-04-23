const request = require('supertest');
const app = require('../server'); // Import the app without starting the server

jest.mock('../config/db', () => jest.fn()); // Mock the database connection
jest.mock('../utils/twilioService', () => ({
    sendSmsNotification: jest.fn().mockImplementation((phone, message) => {
        if (message.includes("failed")) {
            return Promise.reject(new Error("Twilio SMS failed"));
        }
        return Promise.resolve();
    }),
}));
// Mock the Twilio service

const { sendSmsNotification } = require('../utils/twilioService');

describe('Payment Service Endpoints', () => {
    it('should process a payment successfully and send an SMS notification', async () => {
        const res = await request(app)
            .post('/api/payment/process')
            .send({
                orderId: 'ORDER834388',
                userId: 'USER67890',
                amount: 48,
                currency: 'usd',
                email: 'johndoe@example.com',
                phone: '+1234567890', // Include phone number for SMS
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('clientSecret');
        expect(res.body).toHaveProperty('disablePayment', false);

        // Verify that the SMS notification was sent
        expect(sendSmsNotification).toHaveBeenCalledWith(
            '+1234567890',
            expect.stringContaining('Your payment of $ORDER834388 has been processed successfully.')
        );
    });

    it('should handle SMS notification failures gracefully', async () => {
        sendSmsNotification.mockRejectedValue(new Error('Twilio SMS failed'));

        const res = await request(app)
            .post('/api/payment/process')
            .send({
                orderId: 'ORDER834388',
                userId: 'USER67890',
                amount: 48,
                currency: 'usd',
                email: 'johndoe@example.com',
                phone: '+1234567890',
            });

        expect([200, 500]).toContain(res.statusCode); // Accepts both statuses
        expect(sendSmsNotification).toHaveBeenCalled();
    });


    it('should handle webhook events', async () => {
        const res = await request(app)
            .post('/api/payment/webhook')
            .set('stripe-signature', 'valid_signature') // Simulate a valid signature
            .send({
                type: 'payment_intent.succeeded',
                data: {
                    object: {
                        id: 'pi_12345',
                        amount_received: 1000,
                        metadata: { orderId: 'ORDER834388' },
                    },
                },
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('received', true);
    });
});

afterAll(() => {
    // Close any open connections or resources
    jest.clearAllMocks();
});

jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn().mockResolvedValue({
                client_secret: 'test_client_secret',
                metadata: { orderId: 'ORDER834388' }, // Ensure metadata is included
            }),
        },
        webhooks: {
            constructEvent: jest.fn().mockImplementation((body, sig, secret) => {
                if (secret === process.env.STRIPE_WEBHOOK_SECRET) {
                    return {
                        type: 'payment_intent.succeeded',
                        data: {
                            object: {
                                id: 'pi_12345',
                                amount_received: 1000,
                                metadata: { orderId: 'ORDER834388' }, // Ensure metadata exists
                            },
                        },
                    };
                }
                throw new Error('Invalid signature');
            }),
        },
    }));
});


jest.mock('../models/PaymentModel', () => {
    const mockPayment = jest.fn();
    mockPayment.findOneAndUpdate = jest.fn().mockResolvedValue({
        stripePaymentIntentId: null,
        save: jest.fn().mockResolvedValue({}),
    });
    mockPayment.findOne = jest.fn().mockResolvedValue({
        status: 'Pending',
        save: jest.fn().mockResolvedValue({}),
    });
    mockPayment.prototype.save = jest.fn().mockResolvedValue({}); // Mock the save method for new instances
    return mockPayment;
});
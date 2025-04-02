const request = require('supertest');
const app = require('../server'); // Import the app without starting the server

jest.mock('../config/db', () => jest.fn()); // Mock the database connection

describe('Payment Service Endpoints', () => {
    it('should process a payment successfully', async () => {
        const res = await request(app)
            .post('/api/payment/process')
            .send({
                orderId: 'ORDER834388',
                userId: 'USER67890',
                amount: 48,
                currency: 'usd',
                email: 'johndoe@example.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('clientSecret');
        expect(res.body).toHaveProperty('disablePayment', false);
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
                                metadata: { orderId: 'ORDER834388' },
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
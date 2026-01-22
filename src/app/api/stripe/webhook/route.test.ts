import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock gems functions
const mockAddGems = vi.fn();
const mockIsStripeSessionProcessed = vi.fn();
vi.mock('@/lib/gems', () => ({
    addGems: (...args: unknown[]) => mockAddGems(...args),
    isStripeSessionProcessed: (...args: unknown[]) => mockIsStripeSessionProcessed(...args),
}));

// Mock Stripe
const mockConstructEvent = vi.fn();
vi.mock('stripe', () => {
    return {
        default: class MockStripe {
            webhooks = {
                constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
            };
        },
    };
});

describe('/api/stripe/webhook', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        // Set up environment variables
        process.env = {
            ...originalEnv,
            STRIPE_SECRET_KEY: 'sk_test_123',
            STRIPE_WEBHOOK_SECRET: 'whsec_test_123',
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('POST', () => {
        it('should return 503 when webhook secret is not configured', async () => {
            delete process.env.STRIPE_WEBHOOK_SECRET;

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(503);
            expect(data.error).toBe('Webhook non configuré');
        });

        it('should return 400 when signature header is missing', async () => {
            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Signature manquante');
        });

        it('should return 400 when signature verification fails', async () => {
            mockConstructEvent.mockImplementationOnce(() => {
                throw new Error('Invalid signature');
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'invalid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Signature invalide');
        });

        it('should handle checkout.session.completed event and credit gems', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: {
                    userId: 'user123',
                    packId: 'pack_100',
                    gems: '100',
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });
            mockIsStripeSessionProcessed.mockResolvedValueOnce(false);
            mockAddGems.mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).toHaveBeenCalledWith(
                'user123',
                100,
                'Achat pack_100: +100 gemmes',
                'cs_test_123'
            );
        });

        it('should not credit gems for already processed session (idempotency)', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: {
                    userId: 'user123',
                    packId: 'pack_100',
                    gems: '100',
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });
            mockIsStripeSessionProcessed.mockResolvedValueOnce(true); // Already processed

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).not.toHaveBeenCalled(); // Should NOT credit gems again
        });

        it('should handle missing metadata gracefully', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: null, // No metadata
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).not.toHaveBeenCalled();
        });

        it('should handle incomplete metadata gracefully', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: {
                    userId: 'user123',
                    // Missing packId and gems
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).not.toHaveBeenCalled();
        });

        it('should handle invalid gems amount', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: {
                    userId: 'user123',
                    packId: 'pack_100',
                    gems: 'invalid', // Not a number
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).not.toHaveBeenCalled();
        });

        it('should handle payment_intent.payment_failed event', async () => {
            mockConstructEvent.mockReturnValueOnce({
                type: 'payment_intent.payment_failed',
                data: { object: { id: 'pi_test_123' } },
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
            expect(mockAddGems).not.toHaveBeenCalled();
        });

        it('should handle unrecognized event types gracefully', async () => {
            mockConstructEvent.mockReturnValueOnce({
                type: 'some.unknown.event',
                data: { object: {} },
            });

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.received).toBe(true);
        });

        it('should return 500 when addGems fails', async () => {
            const mockSession = {
                id: 'cs_test_123',
                metadata: {
                    userId: 'user123',
                    packId: 'pack_100',
                    gems: '100',
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });
            mockIsStripeSessionProcessed.mockResolvedValueOnce(false);
            mockAddGems.mockRejectedValueOnce(new Error('Database error'));

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Erreur serveur');
        });

        it('should credit correct amount for pack_500', async () => {
            const mockSession = {
                id: 'cs_test_456',
                metadata: {
                    userId: 'user456',
                    packId: 'pack_500',
                    gems: '500',
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });
            mockIsStripeSessionProcessed.mockResolvedValueOnce(false);
            mockAddGems.mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);

            expect(response.status).toBe(200);
            expect(mockAddGems).toHaveBeenCalledWith(
                'user456',
                500,
                'Achat pack_500: +500 gemmes',
                'cs_test_456'
            );
        });

        it('should credit correct amount for pack_1000', async () => {
            const mockSession = {
                id: 'cs_test_789',
                metadata: {
                    userId: 'user789',
                    packId: 'pack_1000',
                    gems: '1000',
                },
            };

            mockConstructEvent.mockReturnValueOnce({
                type: 'checkout.session.completed',
                data: { object: mockSession },
            });
            mockIsStripeSessionProcessed.mockResolvedValueOnce(false);
            mockAddGems.mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'valid_signature',
                },
                body: JSON.stringify({}),
            });

            const response = await POST(request);

            expect(response.status).toBe(200);
            expect(mockAddGems).toHaveBeenCalledWith(
                'user789',
                1000,
                'Achat pack_1000: +1000 gemmes',
                'cs_test_789'
            );
        });
    });
});

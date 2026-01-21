/**
 * API route for Stripe webhooks
 * POST /api/stripe/webhook
 *
 * Handles payment completion events and credits gems to users
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addGems, isStripeSessionProcessed } from '@/lib/gems';

// Initialize Stripe only when needed
function getStripe(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
    });
}

export async function POST(request: NextRequest) {
    try {
        // Check Stripe configuration
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook non configuré' },
                { status: 503 }
            );
        }

        // Get raw body for signature verification
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            console.error('Missing stripe-signature header');
            return NextResponse.json(
                { error: 'Signature manquante' },
                { status: 400 }
            );
        }

        const stripe = getStripe();

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Signature invalide' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('Payment failed:', paymentIntent.id);
                // Could log this or notify user
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const sessionId = session.id;
    const metadata = session.metadata;

    if (!metadata) {
        console.error('No metadata in session:', sessionId);
        return;
    }

    const { userId, packId, gems } = metadata;

    if (!userId || !packId || !gems) {
        console.error('Missing metadata fields:', { userId, packId, gems });
        return;
    }

    const gemsAmount = parseInt(gems, 10);
    if (isNaN(gemsAmount) || gemsAmount <= 0) {
        console.error('Invalid gems amount:', gems);
        return;
    }

    // Check if session was already processed (idempotency)
    const alreadyProcessed = await isStripeSessionProcessed(sessionId);
    if (alreadyProcessed) {
        console.log('Session already processed:', sessionId);
        return;
    }

    // Credit gems to user
    try {
        const description = `Achat ${packId}: +${gemsAmount} gemmes`;
        await addGems(userId, gemsAmount, description, sessionId);
        console.log(`Credited ${gemsAmount} gems to user ${userId} (session: ${sessionId})`);
    } catch (error) {
        console.error('Error crediting gems:', error);
        // In production, you might want to retry or alert
        throw error;
    }
}

// Note: In Next.js App Router, raw body is automatically available via request.text()

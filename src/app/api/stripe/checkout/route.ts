/**
 * API route for creating a Stripe Checkout session
 * POST /api/stripe/checkout
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyUserFromJWT } from '@/lib/access-control';
import { GEM_PACKS, isValidPackId, type GemPackId } from '@/lib/gem-config';

// Initialize Stripe only when needed (lazy initialization)
function getStripe(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
    });
}

interface CheckoutRequest {
    packId: GemPackId;
}

export async function POST(request: NextRequest) {
    try {
        // Check Stripe configuration
        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Stripe non configuré', code: 'STRIPE_NOT_CONFIGURED' },
                { status: 503 }
            );
        }

        // Get JWT from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Non autorisé', code: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        const jwt = authHeader.substring(7);
        const user = await verifyUserFromJWT(jwt);

        if (!user) {
            return NextResponse.json(
                { error: 'Session invalide', code: 'INVALID_SESSION' },
                { status: 401 }
            );
        }

        // Parse request body
        const body: CheckoutRequest = await request.json();
        const { packId } = body;

        // Validate pack ID
        if (!packId || !isValidPackId(packId)) {
            return NextResponse.json(
                { error: 'Pack invalide', code: 'INVALID_PACK' },
                { status: 400 }
            );
        }

        // Get pack details
        const pack = GEM_PACKS.find(p => p.id === packId);
        if (!pack) {
            return NextResponse.json(
                { error: 'Pack introuvable', code: 'PACK_NOT_FOUND' },
                { status: 400 }
            );
        }

        const stripe = getStripe();

        // Determine base URL
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: pack.label,
                            description: `${pack.gems} gemmes pour CODEBOG`,
                            images: [`${origin}/gem-icon.png`], // Optional: add a gem icon
                        },
                        unit_amount: pack.price,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user.userId,
                packId: pack.id,
                gems: pack.gems.toString(),
            },
            customer_email: user.email,
            success_url: `${origin}/shop?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/shop?canceled=true`,
            locale: 'fr',
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                { error: `Erreur Stripe: ${error.message}`, code: 'STRIPE_ERROR' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}

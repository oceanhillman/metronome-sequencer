
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request) {
  if (request.method === 'POST') {
    const { email, priceId } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const success_url = baseUrl + '/get-pro/success';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        customer_email: email,
        success_url: success_url,
        cancel_url: process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_DEV_BASE_URL,
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${request.method} Not Allowed`);
  }
}

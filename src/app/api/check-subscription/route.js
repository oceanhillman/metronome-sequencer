// pages/api/check-subscription.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // List all customers
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // Return false if no customer is found
      return NextResponse.json({ activeSubscription: false });
    }

    const customer = customers.data[0];

    // List all subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all', // Fetch all statuses to determine if any are active
    });

    // Check if any subscription is active
    const hasActiveSubscription = subscriptions.data.some(
      (sub) => sub.status === 'active'
    );

    return NextResponse.json({ activeSubscription: hasActiveSubscription });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

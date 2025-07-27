
export default async function handleCheckout(user, returnPath) {
    if (!user) {
        window.location.href = `/api/auth/login?returnTo=${returnPath}`;
        return;
    }

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, priceId: process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID }),
        });

        const session = await response.json();
        if (session.url) {
            // Redirect to Stripe Checkout
            window.location.href = session.url;
        } else {
            console.error('Failed to create session:', session);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
    }
};
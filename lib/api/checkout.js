
export default async function checkout(user, returnPath) {
    if (!user) {
        window.location.href = `/api/auth/login?returnTo=${returnPath}`;
        return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const successUrl = `${baseUrl}get-pro/success`;

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, priceId: process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID,
                success_url: successUrl,
             }),
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
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Editor from "@/components/Editor";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

import { isSubscribed } from '@lib/api';
import SongLibrary from '@/components/SongLibrary';

export default function Song() {
const { user, error: authError, isLoading } = useUser();
const [error, setError] = useState(null);
const [subscribed, setSubscribed] = useState(false);

function UnauthorizedError() {
    return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
        <p className="text-white">
        Sorry, you don't have permission to view this page!
        </p>
        <Link href="/" className="text-blue-500 underline">Go home</Link>
    </div>
    );
}

useEffect(() => {
    if (isLoading) return;

    if (!user) {
        const returnUrl = '/my-songs';
        window.location.href = `/api/auth/login?returnTo=${returnUrl}`;
        return;
    }

    async function getSubscriptionStatus() {
        const subscriptionStatus = await isSubscribed(user.email);
        setSubscribed(subscriptionStatus);
    }

    getSubscriptionStatus();

    if (!isSubscribed(user.email)) {
        const url = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
        window.location.href = `${url}`
        return;
    }

}, [user, isLoading]);

useEffect(() => {
    console.log("Subscribed:", subscribed);
}, [subscribed])


if (isLoading) return <div>Loading...</div>;
if (error) {
    if (error.status === 403) {
    return <UnauthorizedError />;
    }
    return <div>Error: {error.message}</div>;
}
if (!subscribed) return <div>No song data available</div>;


return <SongLibrary />;
}

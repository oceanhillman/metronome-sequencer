'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isSubscribed } from '@lib/api';

export default function Header() {
    // Session data
    const { user, error, isLoading } = useUser();
    const [subscriptionFetched, setSubscriptionFetched] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            setSubscriptionFetched(true);
            return;
        }

        async function getSubscriptionStatus() {
            const subscriptionStatus = await isSubscribed(user.email);
            setSubscribed(subscriptionStatus);
            setSubscriptionFetched(true);
        }
    
        getSubscriptionStatus();
    }, [user, isLoading]);

    function handleLogout() {
        localStorage.removeItem('unsavedProject');
        window.location.href = '/api/auth/logout';
    }

    const NavContent = () => {
        if (isLoading || !subscriptionFetched) {
            return (
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="h-6 w-24 bg-subtle-gray rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-subtle-gray rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-subtle-gray rounded animate-pulse"></div>
                </div>
            );
        } else if (error) {
            return <div>{error.message}</div>
        } else if (!user) {
            return (
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <Link href="/editor" className="text-cultured hover:text-persian-pink transition-colors no-underline">Song Editor</Link>
                    <Link href="/get-pro" className="text-persian-pink hover:text-persian-pink/80 transition-colors no-underline">Metronome Sequencer Pro</Link>
                    <Link href="/api/auth/login" className="text-cultured hover:text-persian-pink transition-colors no-underline">Login</Link>
                </div>
            );
        } else if (subscribed) {
            return (
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <Link href="/editor" className="text-cultured hover:text-persian-pink transition-colors no-underline">Song Editor</Link>
                    <Link href="/my-songs" className="text-cultured hover:text-persian-pink transition-colors no-underline">My Songs</Link>
                    <Link href="/account" className="text-cultured hover:text-persian-pink transition-colors no-underline">Account</Link>
                    <button onClick={handleLogout} className="text-cultured hover:text-persian-pink transition-colors">Logout</button>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <Link href="/editor" className="text-cultured hover:text-persian-pink transition-colors no-underline">Song Editor</Link>
                    <Link href="/get-pro" className="text-persian-pink hover:text-persian-pink/80 transition-colors no-underline">Upgrade to Pro</Link>
                    <Link href="/account" className="text-cultured hover:text-persian-pink transition-colors no-underline">Account</Link>
                    <button onClick={handleLogout} className="text-cultured hover:text-persian-pink transition-colors">Logout</button>
                </div>
            );
        }
    };

    return (
        <nav className=" bg-eerie-black">
            <div className=" px-4 xxl:mx-32">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-cultured font-orbitron text-xl no-underline">
                        Metronome Sequencer
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden text-cultured focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden lg:flex">
                        <NavContent />
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavContent />
                    </div>
                </div>
            </div>
        </nav>
    );
}

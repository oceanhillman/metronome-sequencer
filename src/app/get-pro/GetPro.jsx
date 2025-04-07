'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isSubscribed } from '@lib/api';

const GetPro = () => {
    const { user, error: authError, isLoading } = useUser();
    const [subscribed, setSubscribed] = useState(false);

    const CheckIcon = (props) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          fill="currentColor" // Inherits text color
          className={props.className}
        >
          <path d="M 12 2 C 6.486 2 2 6.486 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 10.874 21.803984 9.7942031 21.458984 8.7832031 L 19.839844 10.402344 C 19.944844 10.918344 20 11.453 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 7.589 7.589 4 12 4 C 13.633 4 15.151922 4.4938906 16.419922 5.3378906 L 17.851562 3.90625 C 16.203562 2.71225 14.185 2 12 2 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"/>
        </svg>
      );


    const handleCheckout = async () => {
        if (!user) {
            window.location.href = '/api/auth/login';
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

    return (
        <div className="text-cultured min-h-screen bg-eerie-black">
            <section className="bg-eerie-black pt-8 px-4 md:pt-28 lg:pb-4 w-screen lg:w-full">
                <h1 className="font-heading font-bold text-left lg:text-center text-4xl tracking-tight leading-none sm:text-5xl">
                    Perfect practice begins here
                </h1>
            </section>
            <section className="bg-eerie-black">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                    <div className="bg-gunmetal p-4 shadow">
                        <h2 className="font-heading font-bold my-2">Free</h2>
                        <h2><span className="font-bold">$0 </span><span className="text-sm">USD /month</span></h2>
                        <a href="/api/auth/login" className="w-full mt-4 xl:mt-0 inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                            Create account
                        </a>
                        <li className="mt-8 mb-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>Create metronome sequences in the song editor
                        </li>
                        <li className="my-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>Save one song to your song library
                        </li>
                        <li className="my-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>View others' shared songs as read-only
                        </li>
                    </div>
                    <div className="bg-tuna p-4 border-1 border-persian-pink shadow">
                        <h2 className="font-heading font-bold my-2 text-persian-pink">Pro</h2>
                        <h2><span className="font-bold">$1.99 </span> <span className="!text-sm">USD /month</span></h2>
                        <button onClick={handleCheckout} className="w-full mt-4 xl:mt-0 inline-flex items-center justify-center px-5 py-3 shadow text-base no-underline font-medium text-center text-persian-pink border-1 border-persian-pink hover:bg-cultured/5 focus:ring-4 focus:ring-gray-100">
                            Subscribe
                        </button> 
                        <p className="mt-4 font-heading font-bold text-lg">All of our free features, plus:</p>
                        <li className="my-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>Save unlimited songs to your song library
                        </li>
                        <li className="my-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>Share your songs with others
                        </li>
                        <li className="my-4 flex">
                            <span className="mr-2 inline-block">
                                <CheckIcon />
                            </span>Copy others' songs to your library and make your own edits
                        </li>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GetPro;

'use client'
import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { isSubscribed } from '@lib/api'
import { useUser } from '@auth0/nextjs-auth0/client'
const LoaderRing = dynamic(
    () => import('@/components/Loader'),
    {
        ssr: false,
    }
);

export default function SuccessPage() {

    const { user, error: authError, isLoading } = useUser();

    const [pageContent, setPageContent] = useState();
    
    useEffect(() => {
        if (!isLoading && user) {
            if (isSubscribed(user.email)) {
                setPageContent("Thanks for subscribing to Metronome Sequencer Pro!");
            } else {
                setPageContent("Something went wrong. Please try again in a few minutes.")
            }
        } else if (!isLoading && !user) {
            window.location.href = '/';
        }
    }, [isLoading, user]);

    return (
        <div className="flex min-h-screen flex-col items-center bg-eerie-black">
            {isLoading ? 
                <LoaderRing /> : 
                <p>{pageContent}</p>
            }
        </div>
    );
}

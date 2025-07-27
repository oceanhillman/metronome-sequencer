'use client'
import { useEffect } from "react"
import dynamic from 'next/dynamic'
import { checkout } from '@lib/api'
import { useUser } from '@auth0/nextjs-auth0/client'
const LoaderRing = dynamic(
    () => import('@/components/Loader'),
    {
        ssr: false,
    }
);

export default function RedirectPage() {

    const { user, error: authError, isLoading } = useUser();
    
    useEffect(() => {
        checkout(user, '/');
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center bg-eerie-black">
            <LoaderRing />
        </div>
    );
}

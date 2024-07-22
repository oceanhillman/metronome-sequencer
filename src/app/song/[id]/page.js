'use client'
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import { useState, useEffect } from 'react';
import Editor from "@/components/Editor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from '@auth0/nextjs-auth0/client'; // Import useUser to get user information
import Link from 'next/link';

export default function Song() {
    const pathname = usePathname(); // Get the current pathname
    const songId = pathname.split('/').pop(); // Extract the song ID from the pathname

    const { user, error: authError, isLoading } = useUser(); // Use useUser hook to get user info
    const [songPayload, setSongPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function UnauthorizedError() {
        return (
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <p className="text-white">
                    Sorry, you don't have permission to view this song!
                </p>
                <Link href="/" className="text-blue-500 underline">Go home</Link>
            </div>
        );
    }

    useEffect(() => {
        if (isLoading) return; // If auth is loading, do nothing

        if (!user) {
            // Redirect to login page if not authenticated
            window.location.href = '/api/auth/login';
            return;
        }

        if (songId) {
            async function fetchSong() {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/songs/${songId}`);
                    if (response.status === 403) {
                        // Set UnauthorizedError state
                        setError({ status: 403 });
                        return;
                    }
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log('Fetched song data:', data);
                    setSongPayload(data);
                } catch (error) {
                    console.error('Failed to fetch song:', error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }

            fetchSong();
        }
    }, [songId, user, isLoading]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        if (error.status === 403) {
            return <UnauthorizedError />;
        }
        return <div>Error: {error.message}</div>;
    }
    if (!songPayload) return <div>No song data available</div>;

    const song = {
        id: songPayload.id,
        created_at: songPayload.created_at,
        last_saved: songPayload.last_saved,
        title: songPayload.title,
        playlist: songPayload.playlist,
        layout: songPayload.layout,
    };

    return (
        <main className="flex min-h-screen flex-col items-center">
            <Header />
            <Editor songPayload={song} />
            <Footer />
        </main>
    );
}

'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import SongCard from '@/components/SongCard';



export default function songLibrary() {

    const { user, error, isLoading } = useUser();
    const [userSongs, setUserSongs] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    // Function to fetch songs
    async function fetchSongs(userId) {
        try {
            const response = await fetch(`/api/songs/getUserSongs?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setUserSongs(result);
        } catch (error) {
            setFetchError(error.message);
        }
    }

    useEffect(() => {
        // Only fetch songs if the user is available
        if (user?.sub) {
            fetchSongs(user.sub);
        }
    }, [user]); // Dependency array ensures the effect runs when the user changes

    async function deleteSong(id) {
        try {
            const response = await fetch('/api/songs/delete', {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const result = await response.json();
            console.log(result.message); // Handle success message

            fetchSongs(user?.sub);
      
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    }

   

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if (fetchError) return <div>{fetchError}</div>;

    return(
        <div className="flex flex-col justify-center items-center w-full mt-16">
            <h1 className="text-white text-4xl font-roboto">Your Song Library</h1>
                <ul className="m-0 px-1 w-[100%] md:w-[80%] rounded-xl bg-gray-950 grid grid-cols-1 border-2 border-gray-900">
                    {userSongs.map(song => (
                        <li key={song.id} className="my-1">
                            <SongCard
                                id={song.id}
                                title={song.title}
                                created_at={song.created_at}
                                last_saved={song.last_saved}
                                onDelete={deleteSong}
                            />
                        </li>
                    ))}
                </ul>
        </div>
    );
}
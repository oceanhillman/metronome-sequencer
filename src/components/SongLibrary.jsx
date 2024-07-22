'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import SongCard from '@/components/SongCard';

export default function SongLibrary() {
  const { user, error, isLoading } = useUser();
  const [userSongs, setUserSongs] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // New state for fetching

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
    } finally {
      setIsFetching(false); // Set fetching to false after the fetch attempt
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

  function SongLibraryContent() {
        if (isFetching) {
            return(
                <div>Loading...</div>
            );
        }   else {
            return (
                userSongs.map(song => (
                    <li key={song.id} className="">
                    <SongCard
                        id={song.id}
                        title={song.title}
                        created_at={song.created_at}
                        last_saved={song.last_saved}
                        onDelete={deleteSong}
                    />
                    </li>
                ))
            );
        };
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (fetchError) return <div>{fetchError}</div>;

  return (
    <div className="flex flex-col justify-center items-center w-[100%] md:w-[80%] my-16">
        <h1 className="text-cultured text-4xl font-poppins font-bold">Your Song Library</h1>
        <ul className="m-0 w-[100%] md:w-[80%] grid grid-cols-1 bg-chinese-black border-2 border-arsenic rounded-xl p-4 mt-4 space-y-4">
            <SongLibraryContent />
        </ul>
    </div>
  );
}

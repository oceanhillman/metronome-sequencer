'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
// Removed DeleteSongButton import as it's handled by the menu/modal now
import Image from 'next/image';
// Removed CloseIcon import as it's inside the new component
import { titleExists, addSong, renameSong } from '@lib/api';
import { toastSuccess, toastError, toastWarning, toastInfo, toastLoading } from '@lib/utils';

import { ToastContainer, toast } from 'react-toastify';

// Import the new components
import SongActionsMenu from '@/components/SongActionsMenu';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'; // Adjust path if needed
import TextInputModal from '@/components/TextInputModal';

export default function SongLibrary(props) {
  const { user, error, isLoading: authLoading, onFetchComplete } = props
  const [userSongs, setUserSongs] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'last_saved', direction: 'descending' });
  const [openMenuId, setOpenMenuId] = useState(null);

  // State specifically for the delete confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingSongId, setDeletingSongId] = useState(''); // Keep track of which song to delete

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamingSongInfo, setRenamingSongInfo] = useState({ id: null, currentTitle: '' });

  // --- Action Handlers ---

  const handleCopyLink = useCallback(async (songId) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const url = `${baseUrl}/song/${songId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", toastSuccess);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error("Failed to copy link.", toastError);
    }
    setOpenMenuId(null);
  }, []);

  const handleRenameRequest = useCallback((songId, currentTitle) => {
    setRenamingSongInfo({ id: songId, currentTitle: currentTitle }); // Store song info
    setIsRenameModalOpen(true); // Open the modal
    setOpenMenuId(null); // Close the actions menu
  }, []); // No dependencies needed here as it only sets state

  const handleCloseRenameModal = useCallback(() => {
    setIsRenameModalOpen(false);
    // Optional: Clear renaming info when closing without confirming
    // setRenamingSongInfo({ id: null, currentTitle: '' });
  }, []);

  // --- NEW: Handler for confirming the rename action ---
  const handleConfirmRename = useCallback(async (newTitle) => {
    const { id: songId, currentTitle } = renamingSongInfo; // Get song ID and original title

    if (!songId || !newTitle || newTitle.trim() === '') {
        toast.warning("New title cannot be empty.", toastWarn);
        return; // Keep modal open if title is empty
    }
    if (newTitle.trim() === currentTitle) {
        toast.info("Title hasn't changed.", toastInfo);
        setIsRenameModalOpen(false); // Close modal if title is the same
        return;
    }

    setIsRenameModalOpen(false); // Close modal optimistically before API call
    const loadingToastId = toast.loading("Renaming song...", toastLoading);

    try {
        // Call the renameSong utility function from lib/api
        const result = await renameSong(songId, newTitle.trim());

        // Optional: Check result if needed, though renameSong throws on error
        // console.log("Rename successful:", result);

        // Refresh the song list to show the updated title
        await fetchSongs(user?.sub); // Assuming fetchSongs handles user?.sub check

        toast.update(loadingToastId, {
            render: `Song renamed to "${result.song.title}"!`, // Use title from response
            type: "success",
            isLoading: false,
            ...toastInfo
        });

    } catch (error) {
        console.error("Failed to rename song:", error);
        toast.update(loadingToastId, {
            render: `Rename failed: ${error.message || 'Please try again.'}`,
            type: "error",
            isLoading: false,
            ...toastInfo,
            autoClose: 4000 // Give more time for error message
        });
        // Optional: Re-open modal on failure? Or just let user try again?
        // setIsRenameModalOpen(true); // Decide if you want this behavior
    } finally {
        // Clear the renaming info regardless of success/failure
        setRenamingSongInfo({ id: null, currentTitle: '' });
    }
  }, [renamingSongInfo, user?.sub]); // Dependencies needed for this callback

  // Fetch Songs (remains mostly the same, added userId check)
  const fetchSongs = useCallback(async (userId) => {
      if (!userId) return; // Guard against missing userId
      setIsFetching(true);
      setFetchError(null);
      setOpenMenuId(null);
      try {
        const response = await fetch(`/api/songs/getUserSongs?user_id=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const result = await response.json();
        setUserSongs(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setFetchError(error.message);
        setUserSongs([]);
      } finally {
        setIsFetching(false);
        onFetchComplete();
      }
    }, []); // Empty dependency array


  const handleDuplicate = useCallback(async (song) => {
    setOpenMenuId(null);
    if (!user?.sub) {
      toast.warning("You must be logged in to duplicate.", toastWarning);
      return;
    }
    if (!song || !song.title) {
      toast.error("Cannot duplicate: Invalid song data.", toastWarning);
      return;
    }

    const baseTitle = song.title.trim();
    let potentialTitle = '';
    let copyNumber = 0;
    const MAX_DUPLICATE_ATTEMPTS = 100;
    let titleFound = false;
    const loadingToastId = toast.loading("Duplicating song...", toastLoading);

    try {
      while (!titleFound && copyNumber <= MAX_DUPLICATE_ATTEMPTS) {
        let titleToCheck = (copyNumber === 0)
          ? `${baseTitle} (duplicate)`
          : `${baseTitle} (duplicate ${copyNumber})`;
        const exists = await titleExists(titleToCheck);
        if (!exists) {
          potentialTitle = titleToCheck;
          titleFound = true;
        } else {
          copyNumber++;
        }
      }

      if (!titleFound) {
        throw new Error(`Could not find an available duplicate name after ${MAX_DUPLICATE_ATTEMPTS} attempts.`);
      }

      await addSong( // Removed newSongId = as addSong doesn't return ID directly here? Check api.
        user.sub,
        potentialTitle,
        song.playlist ?? null,
        song.layout ?? null
      );

      // Refresh list *after* successful duplication
      await fetchSongs(user.sub); // Use the fetchSongs function

      toast.update(loadingToastId, {
          render: `Song duplicated as "${potentialTitle}"!`,
          type: "success",
          isLoading: false,
          ...toastInfo
      });

    } catch (error) {
      console.error("Error during song duplication:", error);
      toast.update(loadingToastId, {
          render: `Duplication failed: ${error.message}`,
          type: "error",
          isLoading: false,
          ...toastInfo,
          autoClose: 5000
      });
    }
  }, [user?.sub, fetchSongs]); // Added fetchSongs dependency


  // --- Deletion Logic ---
  // Function to *initiate* the delete process (open modal)
  const handleDeleteRequest = useCallback((id) => {
    setDeletingSongId(id);   // Set the ID of the song we intend to delete
    setIsConfirmModalOpen(true); // Open the modal
    setOpenMenuId(null);        // Close the actions menu
  }, []); // No dependencies needed

  // Function to *confirm* the deletion (called by the modal)
  const confirmDeleteSong = useCallback(async () => {
    if (!deletingSongId) return; // Safety check

    setIsConfirmModalOpen(false); // Close confirmation modal *before* starting API call
    const songIdToDelete = deletingSongId; // Store ID in case state changes unexpectedly
    setDeletingSongId(''); // Clear the ID immediately

    const originalSongs = [...userSongs];
    // Optimistic update
    setUserSongs(currentSongs => currentSongs.filter(song => song.id !== songIdToDelete));

    // Optional: Show loading toast
    // const deletingToastId = toast.loading("Deleting song...", toastOptions);

    try {
      const response = await fetch('/api/songs/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: songIdToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete on server: ${response.status} ${response.statusText}. ${errorData}`);
      }

      // toast.dismiss(deletingToastId); // Dismiss loading if used
      toast.success("Song deleted successfully.", toastSuccess);
      // No need to fetch songs again if optimistic update worked, but you could uncomment fetchSongs(user.sub) if preferred

    } catch (error) {
      console.error('Error deleting song:', error);
      // toast.dismiss(deletingToastId); // Dismiss loading if used
      toast.error("Failed to delete song.", toastError);
      setUserSongs(originalSongs); // Revert optimistic update on failure
    }
  }, [deletingSongId, userSongs]); // Dependencies: ID being deleted and the song list for revert

  // --- Fetching Effect --- (remains the same)
  useEffect(() => {
    if (user?.sub && !authLoading) {
      fetchSongs(user?.sub);
    } else if (!authLoading) {
        setIsFetching(false);
        setUserSongs([]);
    }
  }, [user, authLoading, fetchSongs]);


  // --- Sorting Logic --- (remains the same)
  const sortedSongs = useMemo(() => {
    let sortableItems = [...userSongs];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'created_at' || sortConfig.key === 'last_saved') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [userSongs, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setOpenMenuId(null);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

   // --- Menu Toggle/Close Logic --- (remains the same)
   const handleToggleMenu = useCallback((songId) => {
      setOpenMenuId(prevId => (prevId === songId ? null : songId));
   }, []);

   const handleCloseMenu = useCallback(() => {
    setOpenMenuId(null);
   }, []);


  return (
    <div className="w-full my-10">

      {user && !isFetching && userSongs.length === 0 && !fetchError && (
           <div className="text-center text-cultured/70 p-10">
               Your song library is empty. Start creating!
           </div>
       )}

      {!isFetching && userSongs.length > 0 && (
        <div className=" bg-eerie-black xxl:mx-32 xxl:p-4">
          <table className="w-full text-sm text-left text-cultured table-fixed">
            <thead className="text-xs text-gray-400 uppercase bg-muted-blue/30">
              <tr>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50" onClick={() => requestSort('title')}>
                  Title {getSortIndicator('title')}
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50 hidden sm:table-cell w-32 md:w-40" onClick={() => requestSort('created_at')}>
                  Date Created {getSortIndicator('created_at')}
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50 w-36  md:w-48" onClick={() => requestSort('last_saved')}>
                  Last Saved {getSortIndicator('last_saved')}
                </th>
                <th scope="col" className="px-4 py-3 text-center w-16">
                    {/* Actions Header (optional) */}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSongs.map((song) => {
                const createdDate = new Date(song.created_at);
                const savedDate = new Date(song.last_saved);
                // Handle potential invalid dates
                const createdFormatted = !isNaN(createdDate) ? format(createdDate, "MMM dd, yyyy") : 'Invalid Date';
                const savedFormatted = !isNaN(savedDate) ? format(savedDate, "M/d/yy, h:mma") : 'Invalid Date';


                return (
                  <tr key={song.id} className="border-b border-arsenic hover:bg-subtle-gray">
                    <td className="pl-6 py-4 font-medium text-cultured text-nowrap text-ellipsis overflow-hidden max-w-1">
                      <Link
                        href={`/song/${song.id}`}
                        className="no-underline text-cultured hover:underline"
                        title={song.title} // Tooltip with full title
                      >
                        {song.title}
                      </Link>
                    </td>
                    <td className="pl-6 py-4 hidden sm:table-cell text-cultured/60">
                        {createdFormatted}
                    </td>
                    <td className="pl-6 py-4 text-cultured/60">
                        {savedFormatted}
                    </td>
                    <td className="text-center align-middle justify-center">
                      <SongActionsMenu
                        song={song}
                        isOpen={openMenuId === song.id}
                        onToggle={() => handleToggleMenu(song.id)}
                        onClose={handleCloseMenu}
                        onCopyLink={() => handleCopyLink(song.id)} // Pass ID directly
                        onRename={() => handleRenameRequest(song.id, song.title)}
                        onDuplicate={() => handleDuplicate(song)}
                        onDelete={() => handleDeleteRequest(song.id)} // Use the initiating function
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Use the new Modal Component */}
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)} // Simple close action
        onConfirm={confirmDeleteSong} // Call the confirm delete logic
        message="Deleting this song cannot be undone." // Specific message for song deletion
        // Optional: Keep specific button styles if needed, otherwise defaults will be used
        // confirmButtonStyle="px-5 py-2 border-1 text-red-500 border-red-500"
        // cancelButtonStyle="px-5 py-2 bg-cultured text-black"
      />
      <TextInputModal
        isOpen={isRenameModalOpen}
        onClose={handleCloseRenameModal}
        onConfirm={handleConfirmRename} // Pass the confirmation handler
        title="Rename Song"
        initialValue={renamingSongInfo.currentTitle} // Set initial value from state
        placeholder="Enter new song title"
        inputLabel="New Title" // Add a label for clarity
        confirmText="Rename"
        // You can customize button text/styles if needed:
        // cancelText="Cancel"
        // confirmButtonStyle="..."
        // cancelButtonStyle="..."
      />
      <ToastContainer />
    </div>
  );
}
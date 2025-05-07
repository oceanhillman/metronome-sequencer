'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { titleExists, addSong, renameSong } from '@lib/api';
import { toastSuccess, toastError, toastWarning, toastInfo, toastLoading } from '@lib/utils';
import { ToastContainer, toast } from 'react-toastify';

// Import components
import SongActionsMenu from '@/components/SongActionsMenu';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TextInputModal from '@/components/TextInputModal';
import PaginationControls from '@/components/PaginationControls';

// --- Constants ---
const PAGE_SIZE = 20;

// --- Helper Function for Relevance Scoring ---
const calculateRelevanceScore = (title, query) => {
    const lowerTitle = title.toLowerCase();
    const lowerQuery = query.toLowerCase();
    if (lowerTitle === lowerQuery) return 3; // Exact match
    if (lowerTitle.startsWith(lowerQuery)) return 2; // Starts with
    return 1; // Contains
};

export default function SongLibrary(props) {
    const { user, error: authError, isLoading: authLoading, onFetchComplete } = props;

    // --- State Management ---
    const [userSongs, setUserSongs] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // User's explicit sort choice (persists)
    const [sortConfig, setSortConfig] = useState({ key: 'last_saved', direction: 'descending' });
    // Current search text
    const [searchQuery, setSearchQuery] = useState('');
    // Controls which sort method is active: 'relevance' or 'user'
    const [activeSortMethod, setActiveSortMethod] = useState('user'); // <<<--- NEW STATE

    const [openMenuId, setOpenMenuId] = useState(null);
    const [displayPage, setDisplayPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deletingSongId, setDeletingSongId] = useState('');
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renamingSongInfo, setRenamingSongInfo] = useState({ id: null, currentTitle: '' });

    // --- Data Fetching ---
    const fetchSongs = useCallback(async (userId) => {
       // ... (fetch logic remains the same)
        if (!userId) return;
        setIsLoading(true);
        setFetchError(null);
        setOpenMenuId(null);
        try {
            const response = await fetch(`/api/songs/getUserSongs?user_id=${userId}`, { /* ... */ });
            if (!response.ok) throw new Error(/* ... */);
            const result = await response.json();
            if (!Array.isArray(result)) throw new Error(/* ... */);
            setUserSongs(result);
        } catch (error) {
            console.error('Error fetching songs:', error);
            setFetchError(error.message);
            setUserSongs([]);
            setDisplayPage(1); // Reset page on error
            setActiveSortMethod('user'); // Reset sort method on error/empty
            setSearchQuery(''); // Clear search on error
        } finally {
            setIsLoading(false);
            if (onFetchComplete) onFetchComplete();
        }
    }, [onFetchComplete]);

    // --- Initial Fetch Effect ---
    useEffect(() => {
        // ... (effect logic remains the same)
        if (user?.sub && !authLoading) {
            fetchSongs(user?.sub);
        } else if (!authLoading) {
            setUserSongs([]);
            setDisplayPage(1);
            setActiveSortMethod('user');
            setIsLoading(false);
            if (onFetchComplete) onFetchComplete();
        }
    }, [user, authLoading, fetchSongs]);


    // --- Client-Side Filtering & Sorting Logic ---
    const filteredAndSortedSongs = useMemo(() => {
        // 1. Filter based on searchQuery
        let filteredItems = [...userSongs];
        const isSearching = searchQuery.trim() !== '';
        if (isSearching) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filteredItems = filteredItems.filter(song =>
                song.title.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // 2. Determine Sorting Method and Sort
        const shouldUseRelevance = isSearching && activeSortMethod === 'relevance';
        const shouldUseUserSort = !isSearching || (isSearching && activeSortMethod === 'user');

        if (shouldUseRelevance) {
            // --- Relevance Sorting ---
            const lowerQuery = searchQuery.toLowerCase();
            filteredItems.sort((a, b) => {
                const scoreA = calculateRelevanceScore(a.title, lowerQuery);
                const scoreB = calculateRelevanceScore(b.title, lowerQuery);
                if (scoreA !== scoreB) return scoreB - scoreA; // Higher score first

                // Secondary sort: last saved descending
                const dateA = new Date(a.last_saved); const dateB = new Date(b.last_saved);
                const timeA = !isNaN(dateA) ? dateA.getTime() : 0; const timeB = !isNaN(dateB) ? dateB.getTime() : 0;
                return timeB - timeA;
            });
        } else if (shouldUseUserSort) {
            // --- User-Selected Sorting (applies if not searching OR if user explicitly chose while searching) ---
            if (sortConfig.key !== null) {
                filteredItems.sort((a, b) => {
                    let aValue = a[sortConfig.key]; let bValue = b[sortConfig.key];
                    // Date handling
                    if (sortConfig.key === 'created_at' || sortConfig.key === 'last_saved') {
                        aValue = new Date(aValue); bValue = new Date(bValue);
                        if (isNaN(aValue)) aValue = sortConfig.direction === 'ascending' ? Infinity : -Infinity;
                        if (isNaN(bValue)) bValue = sortConfig.direction === 'ascending' ? Infinity : -Infinity;
                    }
                    // String handling (case-insensitive)
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase();
                    }
                    // Comparison
                    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                });
            }
        }
        // If !shouldUseRelevance and !shouldUseUserSort (shouldn't happen, but as fallback)
        // the list remains just filtered.

        return filteredItems;
    // Depend on userSongs, the explicit sortConfig, the query, AND the active sort method
    }, [userSongs, sortConfig, searchQuery, activeSortMethod]);

    // --- Sorting Request Handler (Clicking Headers) ---
    const requestSort = useCallback((key) => {
        // Check if relevance was the active method *before* this click
        const wasRelevanceActive = activeSortMethod === 'relevance';
        let newDirection;

        // Determine the new direction
        if (wasRelevanceActive || key !== sortConfig.key) {
            // If switching from relevance OR clicking a *different* column than the current sortConfig key,
            // always default to descending first.
            newDirection = 'descending';
        } else {
            // If clicking the *same* column header again while already in user-sort mode, toggle the direction.
            newDirection = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }

        // Update the user's preferred sort config
        setSortConfig({ key: key, direction: newDirection });
        // Always switch to 'user' sort method when a header is clicked
        setActiveSortMethod('user');
        // Reset page
        setDisplayPage(1);
        setOpenMenuId(null);

    // Add activeSortMethod to dependencies as its value influences the logic
    }, [sortConfig, activeSortMethod]);

    // --- Sort Indicator ---
    // Show indicator based on user's preference (`sortConfig`),
    // Optionally visually distinguish if relevance is currently active (e.g., dim the indicator)
    const getSortIndicator = (key) => {
        const isSearching = searchQuery.trim() !== '';
        const relevanceActive = isSearching && activeSortMethod === 'relevance';

        // Indicator character
        let indicator = null;
        if (sortConfig.key === key) {
            indicator = sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }

        // If relevance is active, we might want to show no indicator or a dimmed one
        // Option 1: Show nothing if relevance is active
        if (relevanceActive) return null;

        // Option 2: Show the underlying preference, maybe dimmed (requires CSS/styling)
        // We'll just return the indicator based on sortConfig for now.
        // The *behavior* changes, but the indicator shows the user's preference.
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };


    // --- Search Handler ---
    const handleSearchChange = useCallback((event) => {
        const newQuery = event.target.value;
        setSearchQuery(newQuery);
        setDisplayPage(1); // Reset page
        // If user starts typing, default to relevance sort.
        // If user clears search, revert to user sort.
        if (newQuery.trim() !== '') {
            setActiveSortMethod('relevance'); // <<<--- DEFAULT TO RELEVANCE ON SEARCH
        } else {
            setActiveSortMethod('user'); // <<<--- REVERT TO USER SORT ON CLEAR
        }
    }, []); // Dependencies: setters only


    // --- Pagination Calculations ---
    const totalPages = useMemo(() => {
        return Math.ceil(filteredAndSortedSongs.length / PAGE_SIZE) || 1;
    }, [filteredAndSortedSongs.length]);

    // Adjust current page if it becomes invalid
    useEffect(() => {
        if (displayPage > totalPages) {
            setDisplayPage(totalPages);
        }
    }, [displayPage, totalPages]);

    const startIndex = (displayPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const songsToDisplay = useMemo(() => filteredAndSortedSongs.slice(startIndex, endIndex), [filteredAndSortedSongs, startIndex, endIndex]);

    // --- Action Handlers ---
    // (handleCopyLink, handleRenameRequest, handleCloseRenameModal, handleDuplicate, handleDeleteRequest, confirmDeleteSong, handleToggleMenu, handleCloseMenu remain the same as previous version)
    // ... (No changes needed in these handlers for this specific sorting requirement) ...
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
        setRenamingSongInfo({ id: songId, currentTitle: currentTitle });
        setIsRenameModalOpen(true);
        setOpenMenuId(null);
      }, []);

      const handleCloseRenameModal = useCallback(() => {
        setIsRenameModalOpen(false);
      }, []);

      const handleConfirmRename = useCallback(async (newTitle) => {
        const { id: songId, currentTitle } = renamingSongInfo;
        // ... (validation)
        if (!songId || !newTitle || !newTitle.trim() || newTitle.trim() === currentTitle) {
             // Handle validation errors or no change cases
             if (!songId || !newTitle || newTitle.trim() === '') toast.warning("New title cannot be empty.", toastWarning);
             else if (newTitle.trim() === currentTitle) toast.info("Title hasn't changed.", toastInfo);
             setIsRenameModalOpen(false);
             return;
        }

        setIsRenameModalOpen(false);
        const loadingToastId = toast.loading("Renaming song...", toastLoading);
        try {
            const result = await renameSong(songId, newTitle.trim());
            setUserSongs(prevSongs =>
                prevSongs.map(song =>
                    song.id === songId ? { ...song, title: result.song.title, last_saved: result.song.last_saved || new Date().toISOString() } : song
                )
            );
            toast.update(loadingToastId, { render: `Song renamed to "${result.song.title}"!`, type: "success", isLoading: false, ...toastSuccess });
        } catch (error) {
            console.error("Failed to rename song:", error);
            toast.update(loadingToastId, { render: `Rename failed: ${error.message || 'Please try again.'}`, type: "error", isLoading: false, ...toastError, autoClose: 4000 });
        } finally {
            setRenamingSongInfo({ id: null, currentTitle: '' });
        }
      }, [renamingSongInfo]); // Dependency

      const handleDuplicate = useCallback(async (song) => {
        // ... (duplicate logic - uses fetchSongs for refresh)
         setOpenMenuId(null);
        if (!user?.sub) { toast.warning("You must be logged in.", toastWarning); return; }
        if (!song || !song.title) { toast.error("Invalid song data.", toastError); return; }

        const baseTitle = song.title.trim();
        let potentialTitle = ''; let copyNumber = 0; const MAX_ATTEMPTS = 100; let found = false;
        const loadingToastId = toast.loading("Duplicating song...", toastLoading);

        try {
            while (!found && copyNumber <= MAX_ATTEMPTS) {
                let titleToCheck = (copyNumber === 0) ? `${baseTitle} (duplicate)` : `${baseTitle} (duplicate ${copyNumber})`;
                const exists = await titleExists(titleToCheck); // API check assumed
                if (!exists) { potentialTitle = titleToCheck; found = true; } else { copyNumber++; }
            }
            if (!found) throw new Error(`Could not find available duplicate name.`);

            await addSong(user.sub, potentialTitle, song.playlist ?? null, song.layout ?? null);
            await fetchSongs(user.sub); // Refresh list

            toast.update(loadingToastId, { render: `Song duplicated as "${potentialTitle}"!`, type: "success", isLoading: false, ...toastSuccess });
        } catch (error) {
            console.error("Error duplicating song:", error);
            toast.update(loadingToastId, { render: `Duplication failed: ${error.message}`, type: "error", isLoading: false, ...toastError, autoClose: 5000 });
        }
      }, [user?.sub, fetchSongs]); // Dependencies

      const handleDeleteRequest = useCallback((id) => {
        setDeletingSongId(id);
        setIsConfirmModalOpen(true);
        setOpenMenuId(null);
      }, []);

      const confirmDeleteSong = useCallback(async () => {
         // ... (optimistic delete logic)
         if (!deletingSongId) return;
        setIsConfirmModalOpen(false);
        const songIdToDelete = deletingSongId;
        setDeletingSongId('');

        const originalSongs = [...userSongs];
        setUserSongs(currentSongs => currentSongs.filter(song => song.id !== songIdToDelete)); // Optimistic update

        const deletingToastId = toast.loading("Deleting song...", toastLoading);
        try {
            const response = await fetch('/api/songs/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: songIdToDelete }) });
            if (!response.ok) {
                setUserSongs(originalSongs); // Revert
                const errorData = await response.text();
                throw new Error(`Failed to delete on server: ${response.status} ${response.statusText}. ${errorData}`);
            }
            toast.dismiss(deletingToastId);
            toast.success("Song deleted successfully.", toastSuccess);
        } catch (error) {
            setUserSongs(originalSongs); // Revert
            console.error('Error deleting song:', error);
            toast.dismiss(deletingToastId);
            toast.error("Failed to delete song.", toastError);
        }
      }, [deletingSongId, userSongs]); // Dependencies

      const handleToggleMenu = useCallback((songId) => {
        setOpenMenuId(prevId => (prevId === songId ? null : songId));
      }, []);

      const handleCloseMenu = useCallback(() => {
        setOpenMenuId(null);
      }, []);


    // --- Render Logic ---
    return (
        
        <div className="w-full">
                    {user && !isLoading && userSongs.length === 0 && !fetchError && (
                        <div className="text-center text-cultured/70 p-10 xxl:mx-32">
                            Your song library is empty. Start creating!
                        </div>
                    )}

                    {/* Show Controls and Table if user has songs */}
                    {userSongs.length > 0 && (
                        <>
                            {/* Controls Container */}
                            <div className="mb-4 sm:mb-0 xxl:mx-32 flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                                {/* Search Bar */}
                                <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
                                    <input
                                        type="text" placeholder="Search by title..." value={searchQuery} onChange={handleSearchChange}
                                        className="w-full px-4 py-2 rounded-md bg-eerie-black border border-arsenic text-cultured placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-rama"
                                    />
                                </div>
                                {/* Pagination (Always show if songs exist) */}
                                <PaginationControls currentPage={displayPage} totalPages={totalPages} onPageChange={setDisplayPage} />
                            </div>

                            {/* Filtered Empty State */}
                            {filteredAndSortedSongs.length === 0 && searchQuery.trim() !== '' && (
                                <div className="text-center text-cultured/70 p-10 xxl:mx-32">
                                    No songs match your search criteria.
                                </div>
                            )}

                            {/* Song Table (Only show if filtered results exist) */}
                            {filteredAndSortedSongs.length > 0 && (
                                <div className="bg-eerie-black xxl:mx-32 xxl:p-4 overflow-x-auto">
                                    <table className="w-full text-sm text-left text-cultured table-fixed">
                                        <thead className="text-xs text-cultured uppercase bg-muted-blue">
                                        <tr>
                                            {/* Headers use requestSort (sets activeSortMethod='user') & getSortIndicator (shows sortConfig pref) */}
                                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50" onClick={() => requestSort('title')}>
                                            Title {getSortIndicator('title')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50 hidden sm:table-cell w-32 md:w-40" onClick={() => requestSort('created_at')}>
                                            Date Created {getSortIndicator('created_at')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-muted-blue/50 w-36 md:w-48" onClick={() => requestSort('last_saved')}>
                                            Last Saved {getSortIndicator('last_saved')}
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-center w-16"> {/* Actions */} </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/* Map over songsToDisplay */}
                                        {songsToDisplay.map((song) => {
                                            // ... (date formatting)
                                            const createdDate = new Date(song.created_at);
                                            const savedDate = new Date(song.last_saved);
                                            const createdFormatted = !isNaN(createdDate) ? format(createdDate, "MMM dd, yy") : 'Invalid Date';
                                            const savedFormatted = !isNaN(savedDate) ? format(savedDate, "M/d/yy, h:mma") : 'Invalid Date';
                                            return (
                                            <tr key={song.id} className="border-b border-arsenic hover:bg-subtle-gray">
                                                {/* Table Cells */}
                                                <td className="pl-6 py-4 font-medium text-cultured text-nowrap text-ellipsis overflow-hidden max-w-1">
                                                    <Link href={`/song/${song.id}`} className="no-underline text-cultured hover:underline" title={song.title}>{song.title}</Link>
                                                </td>
                                                <td className="pl-6 py-4 hidden sm:table-cell text-cultured/60"> {createdFormatted} </td>
                                                <td className="pl-6 py-4 text-cultured/60"> {savedFormatted} </td>
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

                             {/* Bottom Pagination (Only show if results and more than one page) */}
                             {filteredAndSortedSongs.length > 0 && totalPages > 1 && (
                                <div className="mt-4 xxl:mx-32 px-2 sm:px-4">
                                     <PaginationControls currentPage={displayPage} totalPages={totalPages} onPageChange={setDisplayPage} />
                                 </div>
                             )}
                        </>
                     )}

            {/* Modals */}
            <ConfirmDeleteModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDeleteSong} message="Deleting this song cannot be undone." />
            <TextInputModal isOpen={isRenameModalOpen} onClose={handleCloseRenameModal} onConfirm={handleConfirmRename} title="Rename Song" initialValue={renamingSongInfo.currentTitle} placeholder="Enter new song title" inputLabel="New Title" confirmText="Rename" />
            <ToastContainer />
        </div>
    );
}
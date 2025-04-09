// lib/api/renameSong.js (or wherever your api utility functions reside)

/**
 * Calls the API endpoint to rename a song.
 * @param {number} songId - The ID of the song to rename.
 * @param {string} newTitle - The new title for the song.
 * @returns {Promise<object>} - The JSON response from the API on success.
 * @throws {Error} - Throws an error if the API call fails.
 */
export default async function renameSong(songId, newTitle) {
    try {
      const response = await fetch('/api/songs/renameSong', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: songId, title: newTitle }), // Use 'title' as expected by the API body
      });
  
      const data = await response.json(); // Attempt to parse JSON regardless of status
  
      if (!response.ok) {
        // Use the error message from the API response if available, otherwise use a default
        throw new Error(data.error || `Failed to rename song: ${response.statusText} (Status: ${response.status})`);
      }
  
      return data; // Contains { message: '...', song: { id, title } } on success
  
    } catch (error) {
      console.error("Error calling renameSong API:", error);
      // Re-throw the error so the calling component can handle it (e.g., show a toast)
      throw error;
    }
  };
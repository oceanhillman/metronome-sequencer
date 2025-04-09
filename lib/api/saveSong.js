export default async function saveSong(id, user_id, title, playlist, layout) {
    const now = new Date();
    const saved_at = now.toISOString();

    const updatedSongData = {
        id: id,
        user_id: user_id,
        title: title,
        last_saved: saved_at,
        playlist: JSON.stringify(playlist),
        layout: JSON.stringify(layout),
    };

    try {
        const response = await fetch('/api/songs/updateSong', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSongData),
        });

        if (!response.ok) {
            const errorMessage = response.statusText || 'An error occurred';
            let errorDetails = '';
            try { // Attempt to get more details from the response body
                errorDetails = await response.text();
            } catch(e) {
                console.warn("Could not read error response body");
            }
            // Throw a detailed error
            throw new Error(`Error ${response.status}: ${errorMessage}${errorDetails ? ` - Details: ${errorDetails}` : ''}`);
        }

        const result = await response.json();
        console.log('Song updated successfully!', result);
        // You can return the result if needed elsewhere, or just indicate success
        return { success: true, data: result };

    } catch (error) {
        // Log the detailed error for developers
        console.error('Failed to save song:', error.message);
        // Re-throw the error so it can be caught by the caller (handleSave)
        throw error;
    }
}
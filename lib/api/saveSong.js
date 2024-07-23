

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
            const errorDetails = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage} - Details: ${errorDetails}`);
        }

        const result = await response.json();
        console.log('Song updated successfully!', result);
        return result;

    } catch (error) {
        console.error('Failed to save song:', error.message);
        throw error;
    }
}

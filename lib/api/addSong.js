export default async function addSong(user_id, title, playlist, layout) {
    const now = new Date();
    const created_at = now.toISOString();

    const newSongData = {
        user_id: user_id,
        title: title,
        created_at: created_at,
        last_saved: created_at,
        playlist: JSON.stringify(playlist),
        layout: JSON.stringify(layout),
    };

    try {
        const response = await fetch('/api/songs/addSong', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSongData),
        });

        if (!response.ok) {
            const errorMessage = response.statusText || 'An error occurred';
            const errorDetails = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage} - Details: ${errorDetails}`);
        }

        const result = await response.json();
        console.log('Song added successfully!', result);
        return result;

    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or invalid JSON:', error.message);
            alert('Network error or invalid response format. Please try again later.');
        } else {
            console.error('Error while adding song:', error.message);
            alert('Failed to add song. Please try again later.');
        }

        throw error;
    }
}

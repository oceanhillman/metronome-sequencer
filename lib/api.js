const API_URL = process.env.MONGODB_API_URL;
const API_KEY = process.env.MONGODB_API_KEY;

export async function registerUser(email, password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY, // Set the API key header
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred.');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred.');
    }
}
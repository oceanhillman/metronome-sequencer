export default async function deleteUser(userId) {
    try {
        if (!userId) {
            console.error("Error: userId is undefined");
            return;
        }

        console.log("Sending delete request for user:", userId);

        const response = await fetch('/api/user/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error:", data.error);
            throw new Error(data.error || "Unknown error");
        }

        console.log("User and songs deleted successfully:", data.message);

    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

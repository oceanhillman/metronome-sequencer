export default async function sendResetPassword(email) {
    try {
        if (!email) {
            console.error("Error: email is undefined");
            return;
        }

        const response = await fetch('/api/user/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error:", data.error);
            throw new Error(data.error || "Unknown error");
        }

        console.log("Reset password email triggered successfully:", data.message);

    } catch (error) {
        console.error("Error triggering reset password email:", error);
        throw error;
    }
}

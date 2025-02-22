
export default function logout() {
    // Clear localStorage
    localStorage.removeItem('unsavedProject');

    // Perform the logout
    window.location.href = '/api/auth/logout'; // Or use a custom logout API endpoint
}
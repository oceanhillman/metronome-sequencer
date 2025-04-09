'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'; // Keep Image import if used elsewhere, otherwise remove
import { useUser } from '@auth0/nextjs-auth0/client'
import { redirect } from 'next/navigation';
// Removed isSubscribed and AuthenticationClient imports as they weren't used here
import { deleteUser, logout, sendResetPassword } from '@lib/api';
// Removed CloseIcon import
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'; // Adjust path if needed

export default function AccountManager() {
    const { user, error, isLoading } = useUser();
    // Removed subscription state as it wasn't used
    // const [subscriptionFetched, setSubscriptionFetched] = useState(false);
    // const [subscribed, setSubscribed] = useState(false);
    // const [deleting, setDeleting] = useState(false); // No longer needed directly here
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [isUsernamePasswordUser, setIsUsernamePasswordUser] = useState(false);
    // const [isEmailSent, setIsEmailSent] = useState(false); // Not used
    const [resetPasswordText, setResetPasswordText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

    const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL;

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            redirect('/');
        } else {
            setIsGoogleUser(user.sub.startsWith('google-oauth2|'));
            setIsUsernamePasswordUser(user.sub.startsWith('auth0|'));
        }
    }, [user, isLoading]);

    // Reset Password logic (remains the same)
    const handleResetPassword = async () => {
        if (!user?.email) return; // Added check for email
        setResetPasswordText("");
        try {
            await sendResetPassword(user.email);
            setResetPasswordText("Check your email for a link to reset your password.");
        } catch (error) {
            console.error("Error sending reset password email:", error); // Log error
            setResetPasswordText("An error occurred while sending the reset password email. Please try again.");
        }
    };

    // Delete User logic (now called by the modal confirm)
    const handleDeleteUser = async () => {
        if (!user?.sub) return; // Added check for user sub

        setIsModalOpen(false); // Close modal first

        try {
            await deleteUser(user.sub);
            logout(); // Logout after successful deletion
            // No need to redirect here, logout should handle it
        } catch (error) {
            console.error("Error deleting user:", error); // Log error
            // Optionally show an error message to the user e.g., using a toast notification
            alert("Failed to delete account. Please try again."); // Simple alert for now
        }
    };

    // Function to *initiate* account deletion (open modal)
    const handleRequestDeleteUser = () => {
        setIsModalOpen(true);
    };


    // Conditional Rendering for Reset Password Button (remains the same)
    const ResetPasswordButton = () => {
        if (isUsernamePasswordUser) {
            return(
                <button onClick={handleResetPassword} className="inline-flex items-center justify-center text-base no-underline font-medium text-center text-cyan hover:underline"> {/* Added hover */}
                    Reset Password
                </button>
            );
        } else return null;
    }

    // Component to display reset password message (remains the same)
    const ResetPasswordMessage = () => {
        if (!resetPasswordText) return null; // Don't render if empty
        return(<p className="mt-2 text-sm text-cultured/80">{resetPasswordText}</p>) // Added some styling
    }

    // --- Remove the inline ConfirmModal function ---
    /*
    const ConfirmModal = () => { ... } // DELETE THIS FUNCTION DEFINITION
    */

    if (isLoading) return <div className="text-center text-cultured p-10">Loading...</div>; // Added padding/text color
    if (error) return <div className="text-center text-red-500 p-10">Error: {error.message}</div>; // Added padding
     // Handle case where user is somehow null after loading and no error
    if (!user) return <div className="text-center text-cultured p-10">Not logged in.</div>;


    return (
        <div className="flex justify-center"> {/* Center the content */}
            <section className="w-full max-w-md pt-8 px-4 md:pt-16"> {/* Max width and adjusted padding */}
                <h1 className="text-center mb-4 text-cultured text-2xl font-semibold">Account settings</h1> {/* Styled heading */}
                <p className="text-center mb-6 text-cultured/80"> {/* Styled paragraph */}
                    Logged in as: {user.name || user.email || 'User'} {/* Show email if name is missing */}
                </p>

                <div className="text-center mb-6"> {/* Added margin-bottom */}
                    <ResetPasswordButton />
                    <ResetPasswordMessage />
                </div>

                {/* Use conditional rendering for Stripe link if it might be empty */}
                {STRIPE_LINK && (
                    <a
                      href={STRIPE_LINK}
                      target="_blank" // Open in new tab
                      rel="noopener noreferrer" // Security best practice
                      className="w-full mb-4 inline-flex items-center justify-center py-2.5 px-5 shadow text-base no-underline font-medium text-center text-eerie-black bg-cultured rounded hover:bg-gray-200 focus:ring-4 focus:ring-primary-300 transition-colors" // Adjusted padding/margin/rounding
                    >
                        Manage Subscription
                    </a>
                )}


                <button
                  onClick={handleRequestDeleteUser} // Open the modal on click
                  className="w-full inline-flex items-center justify-center py-2.5 px-5 shadow text-base no-underline font-medium text-center text-red-500 border-2 border-red-500 rounded hover:bg-red-500/10 focus:ring-4 focus:ring-red-300 transition-colors" // Adjusted padding/rounding/hover
                >
                    Delete Account
                </button>

                {/* Use the new Modal Component */}
                <ConfirmDeleteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleDeleteUser} // Pass the actual delete function
                    title="Delete Account?" // More specific title
                    message="All of your data will be erased, including your song library. This action cannot be undone."
                     // Optional: Keep specific button styles if needed
                    // confirmButtonStyle="px-5 py-2 border-1 text-red-500 border-red-500"
                    // cancelButtonStyle="px-5 py-2 bg-cultured text-black"
                />
            </section>
        </div>
    )
}
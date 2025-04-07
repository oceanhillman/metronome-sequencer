'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client'
import { redirect } from 'next/navigation';
import { isSubscribed } from '@lib/api';
import { AuthenticationClient } from 'auth0';
import { deleteUser, logout, sendResetPassword } from '@lib/api';
import CloseIcon from "/public/close.svg"
export default function AccountManager() {

    // Session data
    const { user, error, isLoading } = useUser();
    const [subscriptionFetched, setSubscriptionFetched] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [isUsernamePasswordUser, setIsUsernamePasswordUser] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [resetPasswordText, setResetPasswordText] = useState("");

    const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL;

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            redirect('/'); // Redirect logged-in users to the tool
        } else {
            setIsGoogleUser(user.sub.startsWith('google-oauth2|'));
            setIsUsernamePasswordUser(user.sub.startsWith('auth0|'));
        }
    }, [user, isLoading]);

    useEffect(() => {
        console.log(resetPasswordText);
    }, [resetPasswordText])

    const handleResetPassword = async () => {
        if (isLoading) return;

        setResetPasswordText(""); // Clear previous messages

        try {
            await sendResetPassword(user.email);
            setResetPasswordText("Check your email for a link to reset your password.");
        } catch (error) {
            console.log(error);
            setResetPasswordText("An error occurred while sending the reset password email. Please try again.");
        }
    };

    const handleDeleteUser = async () => {
        if (isLoading) return;
        
        try {
            await deleteUser(user.sub);
            logout();
        } catch (error) {
            console.log(error);
        }
    }

    const ResetPasswordButton = () => {
        if (isUsernamePasswordUser) {
            return(
                <button onClick={handleResetPassword} className="inline-flex items-center justify-center text-base no-underline font-medium text-center text-cyan">
                    Reset Password
                </button>
            );
        } else return null;
    }

    const ResetPasswordMessage = () => {
        return(<p>{resetPasswordText}</p>)
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const ConfirmModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-eerie-black text-cultured border-1 border-red-500 p-6 shadow w-96">
                    <div className="text-right">
                        <button onClick={() => {setIsModalOpen(false)}} className="w-[20px] h-[20px] ml-auto">
                            <Image src={CloseIcon}/>
                        </button>   
                    </div>
                    <h3 className="text-center">Are you sure?</h3>
                    <p className="text-center">All of your data will be erased, including your song library. This action cannot be undone.</p>
                    <div className="flex flex-row justify-center gap-4">
                        <button onClick={() => {setIsModalOpen(false)}} className="px-5 py-2 bg-cultured text-black">Cancel</button>
                        <button onClick={() => {handleDeleteUser()}} className="px-5 py-2 border-1 text-red-500 border-red-500">Delete</button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) return <div>Loading...</div>;
    return (
        <div className="">
            <section className="w-screen lg:w-full pt-8 px-4 md:pt-28">
                <h1 className="text-center mb-4 text-cultured ">Account settings</h1>
                <p className="text-center">
                    {user ? user.name : null}
                </p>

                <div className="text-center lg:max-w-[292px]">
                    <ResetPasswordButton />
                    <ResetPasswordMessage />
                </div>
                
                <a href={STRIPE_LINK} className="w-full mt-4 xl:mt-0 inline-flex items-center justify-center py-3 shadow text-base no-underline font-medium text-center text-eerie-black bg-cultured hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                    Manage Subscription
                </a>

                <button onClick={() => {setIsModalOpen(true)}} className="w-full mt-4 xl:mt-0 inline-flex items-center justify-center py-3 shadow text-base no-underline font-medium text-center text-red-500 border-2 border-red-500 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
                    Delete Account
                </button>

                <ConfirmModal />
            </section>
        </div>
    )
}
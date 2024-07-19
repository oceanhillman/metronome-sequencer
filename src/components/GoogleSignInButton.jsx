'use client'
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

const GoogleSignInButton = () => {
  const handleClick = (event) => {
    event.preventDefault();
    signIn('google', { callbackUrl: "/" }).catch((error) => {
      console.error('Sign-in error:', error);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      <FaGoogle className="mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
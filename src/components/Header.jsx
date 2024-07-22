'use client'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Header() {

    // Session data
    const { user, error, isLoading } = useUser();

    function handleLogout() {
        // Clear localStorage
        localStorage.removeItem('unsavedProject');
    
        // Perform the logout
        window.location.href = '/api/auth/logout'; // Or use a custom logout API endpoint
    }

    function AuthSection() {
        if (isLoading) {
            return <div>Loading...</div>
        } else if (error) {
            return <div>{error.message}</div>
        } else if (!user) {
            return <Button variant="primary"><a href="/api/auth/login" className="mx-1 font-sans">Login</a></Button>
        } else {
            return (
                <Button onClick={handleLogout} className="bg-gunmetal text-cultured border-none font-sans">Logout</Button>
            );
        };
    }

    // Shows logged in user's profile
    function ProfileSection() {
        if (!user) {
            return null;
        } else {
            return (
                <div className="flex flex-row items-center">
                    <div className="mr-4 text-cultured font-sans">
                        Hello, {user.name}!
                    </div>
                    <Link href="/">
                        <Button className="bg-cultured text-eerie-black border-none mr-4 font-sans">Song Editor</Button>
                    </Link>
                    <Link href="/my-songs">
                        <Button className="bg-persian-pink text-eerie-black border-none mr-4 font-sans">My Songs</Button>
                    </Link>
                </div>
            );
        };
    }
            
    return (
        <Navbar className="w-full h-[80px] bg-eerie-black">
            <Container>
                <Link href="/" className="text-cultured font-orbitron font-medium text-4xl">
                    Metronome Sequencer
                </Link>
                <Nav className="flex flex-row items-center">
                    
                    <ProfileSection />
                    
                    <AuthSection />
                </Nav>
            </Container>
        </Navbar>
    );
}
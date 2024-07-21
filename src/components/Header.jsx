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
            return <Button variant="primary"><a href="/api/auth/login" className="mx-1">Login</a></Button>
        } else {
            return (
                <Button onClick={handleLogout} variant="dark">Logout</Button>
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
                    <div className="mr-4 text-white">
                        Hello, {user.name}!
                    </div>
                    <Link href="/">
                        <Button variant="light" className="mr-4">Song Editor</Button>
                    </Link>
                    <Link href="/my-songs">
                        <Button variant="primary" className="mr-4">My Songs</Button>
                    </Link>
                </div>
            );
        };
    }
            
    return (
        <Navbar className="w-full h-[80px]">
            <Container>
                <Link href="/" className="text-white font-cutive-mono text-4xl">
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
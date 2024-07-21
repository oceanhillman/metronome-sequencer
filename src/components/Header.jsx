'use client'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

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
                <Button onClick={handleLogout} variant="primary">Logout</Button>
            );
        };
    }

    // Shows logged in user's profile
    function ProfileSection() {
        if (!user) {
            return null;
        } else {
            return (
                <div className="mr-4">Hello, {user.name}!</div>
            );
        };
    }
            
    return (
        <Navbar className="w-full h-[80px]">
            <Container>
                <Navbar.Brand className="text-white font-cutive-mono md:text-4xl"href="/">
                    Metronome Sequencer
                </Navbar.Brand>
                <Nav className="flex flex-row items-center">
                    <ProfileSection />
                    <AuthSection />
                </Nav>
            </Container>
        </Navbar>
    );
}
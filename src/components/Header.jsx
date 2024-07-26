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
            return <Nav.Link disabled className="!text-cultured">Loading...</Nav.Link>
        } else if (error) {
            return <div>{error.message}</div>
        } else if (!user) {
            return <Nav.Link href="/api/auth/login" className="!text-cultured">Login</Nav.Link>;
        } else {
            return <Nav.Link onClick={handleLogout} className="">Logout</Nav.Link>;
        };
    }

    // Shows logged in user's profile
    function ProfileSection() {
        if (!user) {
            return null;
        } else {
            return (
                <div className="flex lg:flex-row items-center">
                    <Nav.Link href="/" className="!text-cultured">Song Editor</Nav.Link>
                    <Nav.Link href="/my-songs" className="!text-cultured">My Songs</Nav.Link>
                </div>
            );
        };
    }
            
    return (
        <Navbar variant="dark" className="w-full bg-eerie-black" expand="lg">
            <Container>
                <Navbar.Brand href="/" className="text-cultured font-orbitron">
                    Metronome Sequencer
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto flex flex-col lg:flex-row items-center">
                        <ProfileSection />
                        <AuthSection />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

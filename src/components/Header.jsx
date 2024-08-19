'use client'

import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

import { isSubscribed } from '@lib/api';

export default function Header() {

    // Session data
    const { user, error, isLoading } = useUser();
    const [subscriptionFetched, setSubscriptionFetched] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            setSubscriptionFetched(true);
            return;
        }

        async function getSubscriptionStatus() {
            const subscriptionStatus = await isSubscribed(user.email);
            setSubscribed(subscriptionStatus);
            setSubscriptionFetched(true);
        }
    
        getSubscriptionStatus();
    
    }, [user, isLoading]);

    function handleLogout() {
        // Clear localStorage
        localStorage.removeItem('unsavedProject');
    
        // Perform the logout
        window.location.href = '/api/auth/logout'; // Or use a custom logout API endpoint
    }

    function NavContent() {
        if (isLoading || !subscriptionFetched) {
            return <Nav.Link disabled className="!text-cultured">Loading...</Nav.Link>
        } else if (error) {
            return <div>{error.message}</div>
        } else if (!user) {
            return (
                <div className="flex lg:flex-row items-center">
                    <Nav.Link href="/" className="!text-cultured">Song Editor</Nav.Link>
                    <Nav.Link href="/get-premium" className="!text-cyan mx-4">Get Premium</Nav.Link>
                    <Nav.Link href="/api/auth/login" className="!text-cultured">Login</Nav.Link>
                </div>
            );
        } else if (subscribed) {
            return (
                <div className="flex lg:flex-row items-center">
                    <Nav.Link href="/" className="!text-cultured">Song Editor</Nav.Link>
                    <Nav.Link href="/my-songs" className="!text-cultured mx-4">My Songs</Nav.Link>
                    <Nav.Link href="/account" className="!text-cultured mr-4">Account</Nav.Link>
                    <Nav.Link onClick={handleLogout} className="">Logout</Nav.Link>
                </div>
            );
        } else {
            return (
                <div className="flex lg:flex-row items-center">
                    <Nav.Link href="/" className="!text-cultured">Song Editor</Nav.Link>
                    <Nav.Link href="/get-premium" className="!text-cyan mx-4">Get Premium</Nav.Link>
                    <Nav.Link onClick={handleLogout} className="">Logout</Nav.Link>
                </div>
            )
        }
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
                        <NavContent />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

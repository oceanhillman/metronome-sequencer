'use client'

import Image from 'next/image';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function Header() {

    // Session data
    const { user, error, isLoading } = useUser();

    // Shows logout or login button
    const logInOrOut = user ? (
        <Button variant="primary">
            <a href="/api/auth/logout" className="mx-1">Logout</a>
        </Button>
        
    ) : (
        <Button variant="primary">
            <a href="/api/auth/login" className="mx-1">Login</a>
        </Button>
    );

    // Shows logged in user's email
    const emailDisplay = user?.email ? (
        <>
            {user?.email}
        </>
    ) : null;

    // Shows logged in user's picture
    const pictureDisplay = user?.picture ? (
        <Image 
            className="rounded-full"
            src={user?.image}
            width={48}
            height={48}
            alt={user?.name ?? "Profile Pic"}
            priority = {true}
        />
    ) : null;

    // Shows logged in user's profile
    const userProfile = user ? (
        <>
            {emailDisplay}
            {pictureDisplay}
        </>
    ) : (
        null
    );
            
    return (
        <Navbar className="w-full h-[80px]">
            <Container>
                <Navbar.Brand className="text-white font-cutive-mono md:text-4xl"href="/">
                    Metronome Sequencer
                </Navbar.Brand>
                <Nav className="flex flex-row items-center">
                    {logInOrOut}
                    {userProfile}
                </Nav>
            </Container>
        </Navbar>
    );
}
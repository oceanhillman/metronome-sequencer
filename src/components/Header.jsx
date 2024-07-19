'use client'

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
export default function Header({ user }) {

    const logInOrOut = user ? (
        <Button variant="dark"
          className="mr-2"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Log out
        </Button>
      ) : (
        <Link 
          className="mr-2"
          href="/auth/signin"
        >
          Log in
        </Link>
      );

      const userImage = user?.image ? (
        <Image 
            className="rounded-full"
            src={user?.image}
            width={48}
            height={48}
            alt={user?.name ?? "Profile Pic"}
            priority = {true}
        />
      ) : null;

      const emailDisplay = user?.email ? (
        <div className="">
          {user?.email}
        </div>
      ) : null;

      const registerOrUserProfile = user ? (
        <>
          {emailDisplay}
          {userImage}
        </>
      ) : (
        <Link 
          className="mr-2"
          href="/auth/register"
        >
          Register
        </Link>
      );
        
    return (
        <div className="w-full">
            <Navbar className="w-full h-[80px]" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand className="font-cutive-mono text-4xl"href="/">
                        Metronome Sequencer
                    </Navbar.Brand>
                    <Nav className="flex flex-row items-center">
                        {logInOrOut}
                        {registerOrUserProfile}
                    </Nav>
                </Container>
            </Navbar>
            {/* <div className="grid grid-cols-3 h-[80px] border-b-2 border-blue-900 px-[5%] lg:px-[9%]">
                <div className="col-span-2 flex flex-row items-center">
                    <h1 className="font-cutive-mono text-xl lg:text-4xl">
                        Metronome Sequencer
                    </h1>
                </div>
                <div className="flex flex-row justify-end items-center">
                    <a className="p-2">
                        Login
                    </a>
                    <a className="p-2">
                        Signup
                    </a>
                </div>
            </div> */}
        </div>
    )
}
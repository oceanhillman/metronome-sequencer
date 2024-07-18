'use client'

import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
export default function Header() {
    return (
        <div className="w-full">
            <Navbar className="w-full h-[80px] border-b-2 border-blue-900" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand className="font-cutive-mono text-4xl"href="/">
                        Metronome Sequencer
                    </Navbar.Brand>
                    <Nav className="">
                        <Link 
                            className="mr-2"
                            href="/signup">
                            Login
                        </Link>
                        <Link 
                            className="ml-2"
                            href="/signup">
                            Signup
                        </Link>
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
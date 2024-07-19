'use client'
import { useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useRouter } from 'next/navigation';

export default function SignInForm() {
    const router = useRouter();

    const emailRef = useRef("");
    const passwordRef = useRef("");

    
    const handleSubmit = async (e) => {
    
      };
    
    return (
        <Form onSubmit={ handleSubmit } className="text-white bg-gray-900 p-8 rounded-xl border-2 w-[400px] border-gray-800">
            <h1 className="font-roboto font-xl w-full text-center">Sign in</h1>

            <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
            </Form.Group>

            <div className="flex flex-col items-center justify-center">
                <Button variant="primary" type="submit" className="w-full mb-4">
                    Sign in
                </Button>
                <GoogleSignInButton />
                <p className="mt-4 mb-0">
                    Don't have an account? <a href="/auth/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </Form>
    );
}
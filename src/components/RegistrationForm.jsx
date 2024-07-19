'use client';
import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegistrationForm() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        // Basic validation
        // if (!email || !password || !confirmPassword) {
        //     setError('All fields are required.');
        //     return;
        // }
        // if (password !== confirmPassword) {
        //     setError('Passwords do not match.');
        //     return;
        // }

        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful!');
                setError('');
                emailRef.current.value = '';
                passwordRef.current.value = '';
                confirmPasswordRef.current.value = '';
            } else {
                setError(data.error || 'An error occurred. Please try again.');
                setSuccess('');
            }
        } catch (error) {
            setError(error.message || 'An unexpected error occurred.');
            setSuccess('');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="text-white bg-gray-900 p-8 rounded-xl border-2 w-[400px] border-gray-800">
            <h1 className="font-roboto font-xl w-full text-center">Register</h1>

            <Form.Group className="mb-4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" ref={confirmPasswordRef} />
            </Form.Group>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <div className="flex flex-col items-center justify-center">
                <Button variant="primary" type="submit" className="w-full mb-4">
                    Register
                </Button>
               
                <p className="mt-4 mb-0">
                    Already have an account? <a href="/auth/signin" className="text-blue-500">Log in</a>
                </p>
            </div>
        </Form>
    );
}

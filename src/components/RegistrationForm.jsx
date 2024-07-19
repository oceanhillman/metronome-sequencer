'use client'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegistrationForm() {
    
    return (
        <Form className="text-white bg-gray-900 p-8 rounded-xl border-2 w-[400px] border-gray-800">
            <h1 className="font-roboto font-xl w-full text-center">Register</h1>

            <Form.Group className="mb-4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" />
            </Form.Group>

            <div className="flex flex-col items-center justify-center">
                <Button variant="primary" type="submit" className="w-full mb-4">
                    Register
                </Button>
                <GoogleSignInButton />
                <p className="mt-4 mb-0">
                    Already have an account? <a href="/auth/signin" className="text-blue-500">Log in</a>
                </p>
            </div>
        </Form>
    );
}
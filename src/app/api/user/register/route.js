import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    try {
        const response = await fetch('https://us-east-1.aws.data.mongodb-api.com/app/metronomesequencer-cldmzme/endpoint/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MONGODB_API_KEY,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json(data, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}

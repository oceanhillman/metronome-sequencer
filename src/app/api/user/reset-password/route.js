import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

async function getManagementAPIToken() {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
            audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
            grant_type: 'client_credentials',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to obtain Management API token');
    }

    const data = await response.json();
    return data.access_token;
}

export async function POST(req) {
    try {
        const { email } = await req.json(); // Read the email from the request body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Get Management API Token
        const accessToken = await getManagementAPIToken();

        // Trigger the password reset email using the Management API endpoint
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/dbconnections/change_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
                email,
                connection: 'Username-Password-Authentication',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to send password reset email: ${errorData.message}`);
        }

        return NextResponse.json({ message: 'Password reset email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending password reset email:', error); // Log the full error object for more detail
        return NextResponse.json({ error: 'Failed to send password reset email', details: error.message }, { status: 500 });
    }
}

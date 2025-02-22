import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { ManagementClient } from 'auth0';

const management = new ManagementClient({
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
});

export async function POST(req) {
    try { 
        const { userId } = await req.json();
        console.log("Deleting user with ID:", userId);

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Delete user from Auth0
        await management.users.delete({ id: userId });
        console.log("User deleted from Auth0");

        // Delete user's songs from database
        const deleteSongs = await sql`DELETE FROM Songs WHERE user_id = ${userId}`;
        console.log(`Deleted ${deleteSongs.rowCount} songs`);

        // Delete user from database
        const deleteUser = await sql`DELETE FROM Users WHERE user_id = ${userId}`;
        console.log(`Deleted ${deleteUser.rowCount} user(s) from database`);

        return NextResponse.json({ message: "User and associated songs deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: error.message || "Error deleting user." }, { status: 500 });
    }
}

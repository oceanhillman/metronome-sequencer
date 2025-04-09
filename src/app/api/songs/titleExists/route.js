import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
// Keep both imports, assuming you might wrap the export
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

// Define the async function
async function titleExists(request) {
    try {
        // 1. Get user session and authenticated user ID (sub)
        const session = await getSession(request); // Pass request for App Router
        const userId = session?.user?.sub; // Get the unique ID from the session

        if (!userId) {
            // If no user ID found in session, they are not properly authenticated
            return NextResponse.json({ error: 'Unauthorized: User session invalid or missing ID.' }, { status: 401 });
        }

        // 2. Get 'title' from URL query parameters
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title');

        // 3. Validate required 'title' parameter
        if (!title) {
            return NextResponse.json({ error: 'Missing required query parameter: title' }, { status: 400 });
        }

        // 4. Check for song existence using authenticated user ID and title
        const result = await sql`
            SELECT 1
            FROM Songs
            WHERE user_id = ${userId}
              AND title = ${title}
            LIMIT 1;
        `;

        // 5. Return response based on whether a row was found
        const songExists = result.rowCount > 0;
        return NextResponse.json({
            message: songExists ? 'Song found' : 'Song not found',
            exists: songExists
        }, { status: 200 });

    } catch (error) {
        // 6. Log detailed error server-side, return generic error to client
        console.error("API Error checking song existence:", error);
        return NextResponse.json({ error: 'An internal server error occurred while checking the song.' }, { status: 500 });
    }
}

// 7. Export the handler, wrapped with authentication enforcement
export const GET = withApiAuthRequired(titleExists);

// --- OR if you prefer not wrapping the export (less common for protected routes): ---
// export async function GET(request) {
//     // Manually call getSession and check session?.user?.sub as shown inside getSongExistence above
//     return getSongExistence(request); // Call the logic function
// }
// But using the wrapper is generally cleaner for routes needing auth.
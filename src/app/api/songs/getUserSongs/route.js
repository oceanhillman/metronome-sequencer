import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

/**
 * GET /api/songs/getUserSongs
 * Fetches all songs belonging to a specific user.
 * Expects 'user_id' as a query parameter.
 * Returns a JSON array of song objects.
 */
export async function GET(request) {
  try {
    // Parse query parameters from URL
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    // Validate required parameter
    if (!user_id) {
      // Return a 400 Bad Request if user_id is missing
      return NextResponse.json({ error: 'user_id query parameter is required' }, { status: 400 });
    }

    // Query to get all songs for the specified user_id
    // Selecting specific columns is generally better than SELECT * for performance
    // and clarity, but using * is fine if you need all columns.
    // Consider ordering the results server-side by a default (e.g., last_saved desc)
    // even though client-side sorting handles the display. This provides a consistent
    // initial order before the client potentially re-sorts.
    const result = await sql`
      SELECT *
      FROM Songs
      WHERE user_id = ${user_id}
      ORDER BY last_saved DESC; -- Example: Default server-side sort
    `;

    // Always return a 200 OK response.
    // If no songs are found, result.rows will be an empty array [],
    // which is the expected format for the frontend.
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    // Log the error for server-side debugging
    console.error("API Error fetching user songs:", error);

    // Return a generic 500 Internal Server Error
    // Avoid exposing detailed error messages like error.message to the client
    return NextResponse.json({ error: 'Failed to retrieve songs due to a server error.' }, { status: 500 });
  }
}
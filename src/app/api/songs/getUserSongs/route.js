import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Parse query parameters from URL
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ error: 'User_id is required' }, { status: 400 });
    }

    // Query to get all songs for the specified user_id
    const result = await sql`
      SELECT id, title, created_at, last_saved
      FROM Songs
      WHERE user_id = ${user_id};
    `;

    // Check if any songs are found
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'No songs found for this user' }, { status: 404 });
    }

    // Return the songs as JSON
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

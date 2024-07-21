import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export async function GET(request) {
  // Extract the ID from the URL
  const { pathname } = new URL(request.url);
  const songId = pathname.split('/').pop(); // Extract the song ID from the pathname

  if (!songId) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // Get user session from Auth0
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user ID from session
    const userId = session.user.sub;

    // Fetch the song from the database
    const result = await sql`
      SELECT * FROM Songs
      WHERE id = ${songId}
      LIMIT 1;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Song not found' }, { status: 404 });
    }

    // Check if the user is authorized to access the song
    const song = result.rows[0];
    if (song.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not have access to this song' }, { status: 403 });
    }

    return NextResponse.json(song, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

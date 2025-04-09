// app/api/songs/rename/route.js
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export const PATCH = withApiAuthRequired(async function RENAME_SONG(request) {
  try {
    const { user } = await getSession(request);
    const { id, title: newTitle } = await request.json(); // Destructure and rename 'title' to 'newTitle'

    // --- Validation ---
    if (!id || typeof id !== 'number') {
        return NextResponse.json({ error: 'Missing or invalid song ID' }, { status: 400 });
    }
    if (!newTitle || typeof newTitle !== 'string' || newTitle.trim().length === 0) {
        return NextResponse.json({ error: 'Missing or invalid new title' }, { status: 400 });
    }

    const trimmedTitle = newTitle.trim(); // Use trimmed title

    // --- Database Update ---
    // Update the title only if the ID exists AND belongs to the current user
    const result = await sql`
      UPDATE Songs
      SET Title = ${trimmedTitle}
      WHERE id = ${id} AND user_id = ${user.sub}
      RETURNING id, title; -- Return minimal confirmation data
    `;

    // --- Check Result ---
    if (result.rowCount === 0) {
      // Could be because the song ID doesn't exist OR the user doesn't own it.
      // 404 is appropriate as the resource wasn't found for this user to update.
      return NextResponse.json({ error: 'Song not found or user does not have permission to rename' }, { status: 404 });
    }

    // --- Success ---
    return NextResponse.json({ message: 'Song renamed successfully', song: result.rows[0] }, { status: 200 });

  } catch (error) {
    console.error("API Rename Error:", error); // Log the detailed error server-side
    // Handle potential JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to rename song' }, { status: 500 });
  }
});
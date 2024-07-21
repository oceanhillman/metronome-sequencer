import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

// Define the DELETE handler
export const DELETE = withApiAuthRequired(async function DELETE(request) {
  try {
    const { id } = await request.json();

    // Ensure ID is provided
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    // Validate that ID is a valid integer
    if (isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Invalid ID format' }), { status: 400 });
    }

    const { user } = await getSession(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    // Check if song exists and if the user has permission to delete it
    const queryCheck = `
      SELECT * FROM Songs WHERE id = $1;
    `;
    const resultCheck = await sql.query(queryCheck, [id]);

    if (resultCheck.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Song not found' }), { status: 404 });
    }

    // Delete the song
    const queryDelete = `
      DELETE FROM Songs WHERE id = $1 RETURNING *;
    `;
    const resultDelete = await sql.query(queryDelete, [id]);

    if (resultDelete.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Unable to delete song' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Song deleted successfully' }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

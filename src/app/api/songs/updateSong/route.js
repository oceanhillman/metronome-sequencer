import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export const PATCH = withApiAuthRequired(async function getSongById(request) {
  try {
    const { id, user_id, title, last_saved, playlist, layout } = await request.json();

    if (!id || !user_id || !title || !last_saved || !playlist || !layout) {
        return new Response(JSON.stringify({ error: 'Unable to save: missing required fields' }), { status: 400 });
      }
    
    const { user } = await getSession(request);
    if (user?.sub !== user_id) {
        return NextResponse.json({ error: 'Unable to save: user does not own the specified song' }, { status: 403 });
    }

    const query = `
      UPDATE Songs
      SET Title = $1,
          Last_saved = $2,
          Playlist = $3,
          Layout = $4
      WHERE id = $5
      RETURNING *;
    `;

    const result = await sql.query(query, [title, last_saved, playlist, layout, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Unable to save: song not found' }, { status: 404 });
    }

    return NextResponse.json({message: 'Song updated successfully', song: result.rows[0]}, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});

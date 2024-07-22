import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export const PATCH = withApiAuthRequired(async function PATCH(request) {
  try {
    const { id, user_id, title, last_saved, playlist, layout, created_at } = await request.json();

    if (!id || !user_id || !title || !last_saved || !playlist || !layout) {
        return new Response(JSON.stringify({ error: 'Unable to save: missing required fields' }), { status: 400 });
      }
    
    const { user } = await getSession(request);
    if (user.sub !== user_id) {
        return NextResponse.json({ error: 'Unable to save: user does not own the specified song' }, { status: 403 });
    }
    console.log(user);

    let parsedPlaylist;
    let parsedLayout;

    try {
      parsedPlaylist = JSON.parse(playlist);
      parsedLayout = JSON.parse(layout);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return NextResponse.json({ error: 'Invalid input: playlist and layout must be valid JSON strings' }, { status: 400 });
    }

    if (!id || typeof id !== 'number' ||
        !user_id || typeof user_id !== 'string' ||
        !title || typeof title !== 'string' ||
        !last_saved || typeof last_saved !== 'string' ||
        !playlist || !Array.isArray(parsedPlaylist) ||
        !layout || !Array.isArray(parsedLayout)) {

      console.error('Validation Error:', { id, user_id, title, last_saved, playlist, layout });

      return NextResponse.json({ error: 'Unable to save: incorrect types for required fields' }, { status: 400 });
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

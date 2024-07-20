import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse JSON body from the request
    const { user_id, title, created_at, last_saved, playlist, layout } = await request.json();

    // Validate required fields
    if (!user_id || !title || !playlist || !layout) {
      return NextResponse.json({ error: `Important field missing ${user_id} ${title} ${playlist} ${layout}` }, { status: 400 });
    }

    // Check user exists
    const existingUser = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM users 
        WHERE user_id = ${user_id}
      ) AS user_exists;
    `;
    if (!existingUser.rows[0].user_exists) {
      return NextResponse.json({ error: "User doesn't exist." }, { status: 400 });
    }

    // Prevent duplicate title
    const existingTitle = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM songs 
        WHERE user_id = ${user_id} AND title = ${title}
      ) AS song_exists;
    `;
    if (existingTitle.rows[0].song_exists) {
      return NextResponse.json({ error: 'User already has a song with that title.' }, { status: 400 });
    }

    // Insert song
    await sql`
      INSERT INTO songs (user_id, title, created_at, last_saved, playlist, layout) 
      VALUES (${user_id}, ${title}, ${created_at}, ${last_saved}, ${playlist}, ${layout})
    `;

    return NextResponse.json("Successfully added song", { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

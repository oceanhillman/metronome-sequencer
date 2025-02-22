import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse JSON body from the request
    const { user_id, email, name } = await request.json();

    // Validate required fields
    if (!user_id || !email || !name) {
      return NextResponse.json({ error: 'User_id, email, and name are required' }, { status: 400 });
    }

    // Prevent duplicate user_id
    const existingUserId = await sql`SELECT 1 FROM Users WHERE User_id = ${user_id} LIMIT 1`;
    if (existingUserId.rowCount > 0) {
      return NextResponse.json({ error: 'User_id already exists' }, { status: 400 });
    }

    // Prevent duplicate email
    const existingEmail = await sql`SELECT 1 FROM Users WHERE Email = ${email} LIMIT 1`;
    if (existingEmail.rowCount > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Insert user
    await sql`INSERT INTO Users (User_id, Email, Name) VALUES (${user_id}, ${email}, ${name})`;

    // Respond with the newly created user
    const user = await sql`SELECT * FROM Users WHERE User_id = ${user_id} LIMIT 1`;
    return NextResponse.json({ user: user.rows[0] }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const email = searchParams.get('email');
  const name = searchParams.get('name');
 
  try {
    if (!user_id || !email || !name) {
      return NextResponse.json({ error: 'User_id, email, and name are required' }, { status: 400 });
    }

    // Prevent duplicate user_id
    const existingUser_id = await sql`SELECT 1 FROM Users WHERE User_id = ${user_id} LIMIT 1`;
    if (existingUser_id.rowCount > 0) {
      return NextResponse.json({ error: 'User_id already exists' }, { status: 400 });
    }

    // Prevent duplicate email
    const existingEmail = await sql`SELECT 1 FROM Users WHERE Email = ${email} LIMIT 1`;
    if (existingEmail.rowCount > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Insert user
    await sql`INSERT INTO Users (User_id, Email, Name) VALUES (${user_id}, ${email}, ${name})`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  // Respond with user
  const user = await sql`SELECT 1 FROM Users WHERE User_id = ${user_id} LIMIT 1`;
  return NextResponse.json({ user }, { status: 200 });
}
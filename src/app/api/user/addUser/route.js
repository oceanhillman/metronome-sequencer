// app/api/addUser/route.js
import { Pool } from 'pg';

// Create a pool instance with your PostgreSQL connection details
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !name) {
      return new Response('Missing email or name', { status: 400 });
    }

    // Insert user into the database
    const query = 'INSERT INTO users (email, name) VALUES ($1, $2)';
    const values = [email, name];
    await pool.query(query, values);

    return new Response('User added successfully', { status: 200 });
  } catch (error) {
    console.error('Error adding user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

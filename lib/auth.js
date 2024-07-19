import { Lucia } from 'lucia';
import bcrypt from 'bcryptjs';

export const adapter = new MongodbAdapter(
  mongoose.connection.collection(""), // sessions collection
  mongoose.connection.collection("") // users collection
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  }
});

export async function hashPassword(password) {
  const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
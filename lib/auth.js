import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
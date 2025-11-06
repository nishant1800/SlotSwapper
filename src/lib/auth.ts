import 'server-only';
import { cookies } from 'next/headers';
import { findUserById, users } from './data';
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'session';

// This would be a database (e.g., Redis) in a real app
const sessions = new Map();

// Dummy password verification. In a real app, use a library like argon2 or bcrypt.
// The password hash in data.ts is just for show.
export async function verify(password, user) {
  if (user.name === 'Alice' && password === 'password123') return true;
  if (user.name === 'Bob' && password === 'password456') return true;
  if (user.name === 'Charlie' && password === 'password789') return true;
  // For newly created users
  if (password === 'password') return true;
  return false;
}

export async function createSession(userId) {
  const sessionId = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(sessionId, { userId, expires });

  cookies().set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const session = sessions.get(sessionId);
  if (!session || session.expires < new Date()) {
    if (session) sessions.delete(sessionId);
    // Clean up expired sessions from cookies as well
    cookies().delete(SESSION_COOKIE_NAME);
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
}

export async function deleteSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    sessions.delete(sessionId);
    cookies().delete(SESSION_COOKIE_NAME, { path: '/' });
  }
}

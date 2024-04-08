import { db } from './db';

export async function createUser(username: string, passHash: string) {
  return db.user.create({ data: { username, passHash } });
}

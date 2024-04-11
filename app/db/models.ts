import { getImageAsDataUrl } from '~/utils/dashboard.server';
import { db } from './db';

export async function createUser(username: string, passHash: string) {
  return db.user.create({ data: { username, passHash } });
}

export async function createMessage(userId: string, image: string) {
  return db.message.create({
    data: { authorId: userId, path: image },
  });
}

export async function readMessages(userId: string) {
  const query = await db.message.findMany({
    where: {
      authorId: { equals: userId },
    },
    select: {
      id: true,
      path: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  const messages = query.map((entry) => {
    return {
      id: entry.id,
      url: getImageAsDataUrl(entry.path),
      username: entry.author.username,
    };
  });

  return messages;
}

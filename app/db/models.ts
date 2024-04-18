import { db } from './db';

export async function createUser(username: string, passHash: string) {
  return db.user.create({ data: { username, passHash } });
}

export async function createMessage(userId: string, image: string) {
  return db.message.create({
    data: { authorId: userId, image: image },
  });
}

export async function readMessages(userId: string) {
  const query = await db.message.findMany({
    where: {
      authorId: { equals: userId },
    },
    select: {
      id: true,
      image: true,
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
      url: entry.image,
      username: entry.author.username,
    };
  });

  return messages;
}

export async function readAllMessages() {
  const query = await db.message.findMany({
    select: {
      id: true,
      image: true,
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
      url: entry.image,
      username: entry.author.username,
    };
  });

  return messages;
}

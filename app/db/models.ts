import { db } from './db';
import * as argon2 from 'argon2';

export async function createUser(username: string, password: string) {
  const hashedPassword = await argon2.hash(password);

  return db.user.create({ data: { username, passHash: hashedPassword } });
}

export async function getUser(username: string) {
  const query = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  return query;
}

export async function getUserPicture(username: string) {
  const query = await db.user.findFirst({
    where: {
      username: username,
    },
    select: {
      picture: true,
    },
  });

  return query?.picture;
}

export async function updateUserProfilePic(username: string, image: string) {
  const query = await db.user.update({
    where: {
      username: username,
    },
    data: {
      picture: image,
    },
  });

  return query;
}

export async function deleteMessage(id: string) {
  const query = await db.message.delete({
    where: {
      id: id,
    },
  });

  return query;
}

export async function createMessage(
  author: string,
  image: string,
  threadId: string
) {
  return db.message.create({
    data: { author, dataURL: image, threadId },
  });
}

export async function getAllUsers() {
  const query = await db.user.findMany({
    select: {
      username: true,
    },
    orderBy: {
      username: 'asc',
    },
  });
  return query;
}

export async function getThread(threadId: string) {
  const query = await db.thread.findFirst({
    where: {
      id: threadId,
    },
  });

  return query;
}

export async function getUsersThreads(username: string) {
  const query = await db.thread.findMany({
    where: {
      members: {
        some: {
          username: username,
        },
      },
    },
    select: {
      id: true,
      name: true,
      picture: true,
      members: {
        select: {
          user: {
            select: {
              username: true,
              picture: true,
            },
          },
        },
      },
    },
  });

  const data = query.map((thread) => {
    return {
      id: thread.id,
      members: thread.members.map((item) => {
        return item.user.username;
      }),
      name: thread.name,
      picture: thread.picture,
    };
  });

  return data;
}

export async function createNewThread(
  username: string,
  recipientUsername: string
) {
  let threadExists = false;

  const usernames = [username, recipientUsername];

  //returns all threads that have the given usernames as group members
  const threadQuery = await db.thread.findFirst({
    where: {
      members: {
        every: {
          username: {
            in: usernames,
          },
        },
      },
    },
    select: {
      id: true,
      members: true,
    },
  });

  // if the number of group members for the thread is equal to the specified number
  // of group members, we can be sure that the thread already exists
  if (threadQuery?.members.length === usernames.length) {
    threadExists = true;
    return threadQuery.id;
  }

  if (threadExists === false) {
    const newThread = await db.thread.create({ data: {} });

    const newMembersPromises = [username, recipientUsername].map(
      async (username) => {
        return await db.groupMember.create({
          data: {
            username: username,
            threadId: newThread.id,
          },
        });
      }
    );

    const newMembers = await Promise.all(newMembersPromises);
    return newThread.id;
  }
}

export async function getMessagesOfThread(threadId: string) {
  const query = await db.message.findMany({
    where: {
      threadId: threadId,
    },
  });

  const messageArr = query.map((message) => {
    return {
      id: message.id,
      username: message.author,
      url: message.dataURL,
    };
  });

  return messageArr;
}

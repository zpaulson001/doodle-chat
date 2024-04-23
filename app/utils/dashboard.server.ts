import { redirect } from '@remix-run/node';
import fs from 'fs';
import { createMessage, createNewThread } from '~/db/models';
import { emitter } from './emitter.server';

export function getImageAsDataUrl(path: string) {
  const base64 = fs.readFileSync(path, 'base64');
  const url = `data:image/png;base64,${base64}`;
  return url;
}

export async function handleCreateMessage(
  username: string,
  formData: FormData,
  threadId: string
) {
  const drawing = formData.get('drawing') as string;

  if (drawing !== null) {
    await createMessage(username, drawing, threadId);
    emitter.emit('chat');
    return 'image created';
  }

  return null;
}

export async function handleCreateNewThread(formData: FormData) {
  const myUsername = formData.get('myUsername');
  const recipientUsername = formData.get('recipientUsername');

  if (myUsername && recipientUsername) {
    const newThreadId = await createNewThread(
      myUsername as string,
      recipientUsername as string
    );

    if (newThreadId) {
      return redirect(`/dashboard/${newThreadId}`);
    }
  }

  return null;
}

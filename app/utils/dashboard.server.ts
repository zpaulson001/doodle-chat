import {} from '@remix-run/node';
import fs from 'fs';
import { createMessage } from '~/db/models';
import { emitter } from './emitter.server';

export function getImageAsDataUrl(path: string) {
  const base64 = fs.readFileSync(path, 'base64');
  const url = `data:image/png;base64,${base64}`;
  return url;
}

export async function handleCreateMessage(userId: string, formData: FormData) {
  const drawing = formData.get('drawing') as string;

  if (drawing !== null) {
    await createMessage(userId, drawing);
    emitter.emit('chat');
    return 'image created';
  }

  return null;
}

import fs from 'fs';

export function getImageAsDataUrl(path: string) {
  const base64 = fs.readFileSync(path, 'base64');
  const url = `data:image/png;base64,${base64}`;
  return url;
}

import { useFetcher } from '@remix-run/react';
import { Button } from './ui/button';
import { Send, Trash2 } from 'lucide-react';
import DrawingPad from './drawingPad';

export default function ChatBar() {
  const fetcher = useFetcher();
  return (
    <div>
      <div className="flex gap-2">
        <DrawingPad />
      </div>
    </div>
  );
}

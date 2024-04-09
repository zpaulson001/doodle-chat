import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, Trash2 } from 'lucide-react';

function setUpCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  let isDrawing = false;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  function startPosition(e: MouseEvent) {
    isDrawing = true;
    draw(e);
  }

  function endPosition() {
    isDrawing = false;
    ctx?.beginPath();
  }

  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    if (e.offsetX <= 0 || e.offsetY <= 0) {
      endPosition();
      return;
    }
    console.log(`${e.offsetX}, ${e.offsetY}`);
    ctx?.lineTo(e.offsetX, e.offsetY);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.moveTo(e.offsetX, e.offsetY);
  }

  canvas.addEventListener('mousedown', (e) => startPosition(e));
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', (e) => draw(e));
  canvas.addEventListener('mouseout', endPosition);
}

export default function DrawingPad() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current === null) {
      return;
    } else {
      setUpCanvas(canvas.current);
    }
  }, []);

  function handleClear() {
    if (canvas.current === null) {
      return;
    } else {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
      }
    }
  }

  return (
    <div className="flex gap-2">
      <canvas
        className="rounded-md border border-input bg-background p-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={canvas}
      ></canvas>
      <div className="flex flex-col-reverse gap-2">
        <Button variant="outline" size="icon">
          <Send className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

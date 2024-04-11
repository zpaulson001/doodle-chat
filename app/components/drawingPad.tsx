import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, Trash2 } from 'lucide-react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/node';

function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function setUpCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  clearCanvas(canvas);

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
    // console.log(`${e.offsetX}, ${e.offsetY}`);
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

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
}

export default function DrawingPad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fetcher = useFetcher();
  const data = useLoaderData();

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
      clearCanvas(canvas.current);
    }
  }

  function handleSubmit() {
    console.log(data);
    if (canvas.current === null) {
      return;
    } else {
      const formData = new FormData();
      canvas.current.toBlob((blob) => {
        if (blob !== null) {
          formData.append('drawing', blob, `${crypto.randomUUID()}.png`);
          formData.append('intent', 'sendMessage');
          console.log(formData);
          fetcher.submit(formData, {
            method: 'post',
            encType: 'multipart/form-data',
          });
        }

        if (canvas.current) clearCanvas(canvas.current);
      }, 'image/png');
    }
  }

  return (
    <div className="flex gap-2">
      <canvas
        className="h-[180px] w-[300px] rounded-md border border-input bg-white p-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={canvas}
      ></canvas>
      <div className="flex flex-col-reverse gap-2">
        <Button variant="outline" size="icon" onClick={handleSubmit}>
          <Send className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

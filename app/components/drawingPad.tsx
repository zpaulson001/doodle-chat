import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, Trash2 } from 'lucide-react';
import { useFetcher } from '@remix-run/react';
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

  type Position = {
    x: number;
    y: number;
  };

  function getPosition(e: MouseEvent | TouchEvent) {
    let x = 0;
    let y = 0;

    if (e instanceof MouseEvent) {
      x = e.offsetX;
      y = e.offsetY;
    } else if (e instanceof TouchEvent) {
      const canvasRect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - canvasRect.x;
      y = e.touches[0].clientY - canvasRect.y;
    }

    return { x, y };
  }

  function startPosition(pos: Position) {
    isDrawing = true;
    draw(pos);
  }

  function endPosition() {
    isDrawing = false;
    ctx?.beginPath();
  }

  function draw({ x, y }: Position) {
    if (!isDrawing) return;
    if (x <= 0 || y <= 0) {
      endPosition();
      return;
    }
    ctx?.lineTo(x, y);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  }

  document.body.addEventListener(
    'touchstart',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
  document.body.addEventListener(
    'touchend',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
  document.body.addEventListener(
    'touchmove',
    (e) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  canvas.addEventListener('mousedown', (e) => startPosition(getPosition(e)));
  canvas.addEventListener('touchstart', (e) => {
    startPosition(getPosition(e));
  });
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('touchend', endPosition);
  canvas.addEventListener('mousemove', (e) => draw(getPosition(e)));
  canvas.addEventListener('touchmove', (e) => draw(getPosition(e)));
  canvas.addEventListener('mouseout', endPosition);
  canvas.addEventListener('touchcancel', endPosition);
}

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
}

export default function DrawingPad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fetcher = useFetcher();

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
    if (canvas.current === null) {
      return;
    } else {
      const formData = new FormData();

      const dataUrl = canvas.current.toDataURL();

      formData.append('drawing', dataUrl);
      formData.append('intent', 'sendMessage');
      fetcher.submit(formData, {
        method: 'post',
      });

      if (canvas.current) clearCanvas(canvas.current);
    }
  }

  return (
    <div className="flex gap-2">
      <canvas
        className="h-[150px] w-[300px] rounded-md border border-input bg-white p-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

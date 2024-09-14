import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

function setUpCanvas(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
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

  function clearCanvas(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

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
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
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

type CanvasProps = {
  height?: number;
  width?: number;
  className?: string;
};

export type DrawingCanvasRef = {
  clearCanvas: () => void;
  getDataUrl: () => string | undefined;
};

function DrawingCanvas(
  { height = 180, width = 300, className }: CanvasProps,
  ref: Ref<DrawingCanvasRef>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setUpCanvas(canvasRef.current);
  }, []);

  function clearCanvas(canvas: HTMLCanvasElement | null) {
    console.log('in clear canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function getDataUrl(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    return dataUrl;
  }

  useImperativeHandle(ref, () => {
    return {
      clearCanvas: () => clearCanvas(canvasRef?.current),
      getDataUrl: () => getDataUrl(canvasRef?.current),
    };
  });

  return (
    <canvas
      width={width}
      height={height}
      className={`border border-input bg-white p-0 shadow-sm ${className}`}
      ref={canvasRef}
    ></canvas>
  );
}

// DrawingCanvas.displayName = 'DrawingCanvas';

export default forwardRef(DrawingCanvas);

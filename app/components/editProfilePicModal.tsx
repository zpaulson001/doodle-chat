import { SquarePen, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useRef } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from './drawingCanvas';

export default function EditProfilePicModal() {
  const canvasRef = useRef<DrawingCanvasRef>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DrawingCanvas
          height={192}
          width={192}
          ref={canvasRef}
          className="rounded-full"
        ></DrawingCanvas>
        <Button
          variant="outline"
          onClick={() => canvasRef.current?.clearCanvas()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

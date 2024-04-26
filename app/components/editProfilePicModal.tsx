import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter } from './ui/dialog';
import { useEffect, useRef } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from './drawingCanvas';
import { useFetcher } from '@remix-run/react';

type EditProfilePicModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfilePicModal({
  open,
  setOpen,
}: EditProfilePicModalProps) {
  const fetcher = useFetcher();
  const canvasRef = useRef<DrawingCanvasRef>(null);

  useEffect(() => {
    if (fetcher.state === 'idle' || fetcher.state === 'loading') {
      setOpen(false);
    }
  }, [fetcher.state]);

  function handleSubmit() {
    const formData = new FormData();
    formData.append('intent', 'updateUserProfilePic');
    formData.append('picture', canvasRef.current?.getDataUrl() as string);
    fetcher.submit(formData, { method: 'POST' });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-max">
        <div className="px-8 flex justify-center">
          <div>
            <Button
              variant="outline"
              className="rounded-full h-12 w-12 p-2 relative top-8 right-8 hover:text-red-400"
              onClick={() => canvasRef.current?.clearCanvas()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <DrawingCanvas
              height={192}
              width={192}
              ref={canvasRef}
              className="rounded-full"
            ></DrawingCanvas>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              fetcher.state === 'submitting' || fetcher.state === 'loading'
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

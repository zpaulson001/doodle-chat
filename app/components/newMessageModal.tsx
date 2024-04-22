import { SquarePen } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import UserList from './userList';

export default function NewMessageModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>Select a recipient</DialogDescription>
        </DialogHeader>
        <UserList />
      </DialogContent>
    </Dialog>
  );
}

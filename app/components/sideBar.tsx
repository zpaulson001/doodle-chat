import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Form } from '@remix-run/react';
import ThreadList from './threadList';
import { LogOut } from 'lucide-react';
import NewMessagePopOver from './newMessagePopover';

type SideBarProps = {
  className?: string;
};

export default function SideBar({ className }: SideBarProps) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader className="flex-row flex-nowrap gap-4 justify-between items-center">
        <CardTitle>Chat</CardTitle>
        <NewMessagePopOver />
      </CardHeader>
      <CardContent className="flex-grow">
        <ThreadList />
      </CardContent>
      <CardFooter className="flex-row justify-end">
        <Form method="post">
          <Button name="intent" variant="outline" value="logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
}

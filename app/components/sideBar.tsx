import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Form } from '@remix-run/react';
import NewMessageModal from './newMessageModal';
import ThreadList from './threadList';

type SideBarProps = {
  className?: string;
};

export default function SideBar({ className }: SideBarProps) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader className="flex-row flex-nowrap gap-4 justify-between items-center">
        <CardTitle>Chat</CardTitle>
        <NewMessageModal />
      </CardHeader>
      <CardContent className="flex-grow">
        <ThreadList />
      </CardContent>
      <CardFooter>
        <Form method="post">
          <Button name="intent" value="logout">
            Log out
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
}

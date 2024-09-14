import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Form, useLoaderData } from '@remix-run/react';
import ThreadList from './threadList';
import { LogOut } from 'lucide-react';
import NewMessagePopOver from './newMessagePopover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { loader } from '~/routes/dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import EditProfilePicModal from './editProfilePicModal';
import { useState } from 'react';

type SideBarProps = {
  className?: string;
};

export default function SideBar({ className }: SideBarProps) {
  const { myUsername, myPicture } = useLoaderData<typeof loader>();
  const [openEditProfilePicModal, setOpenEditProfilePicModal] = useState(false);

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader className="flex-row flex-nowrap gap-4 justify-between items-center">
        <CardTitle>Chat</CardTitle>
        <NewMessagePopOver />
      </CardHeader>
      <CardContent className="flex-grow">
        <ThreadList />
      </CardContent>
      <CardFooter className="flex-row gap-4 justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus-visible:outline-none">
              <Avatar className={myPicture ? 'border border-slate-300' : ''}>
                <AvatarImage
                  src={
                    myPicture ||
                    `https://api.dicebear.com/8.x/thumbs/svg?scale=75&seed=${myUsername}`
                  }
                />
                <AvatarFallback>{myUsername.substring(0, 1)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="active:bg-emerald-100"
              onClick={() => setOpenEditProfilePicModal(true)}
            >
              Edit profile pic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditProfilePicModal
          open={openEditProfilePicModal}
          setOpen={setOpenEditProfilePicModal}
        />
        <Form method="post">
          <Button name="intent" variant="outline" value="logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
}

import { useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { loader } from '~/routes/dashboard';

type userButtonProps = {
  username: string;
};

export default function UserButton({ username }: userButtonProps) {
  const { myUsername } = useLoaderData<typeof loader>();

  if (username === myUsername) return null;

  return (
    <Button
      variant="outline"
      className="h-16 gap-4 w-full flex px-8 justify-start"
    >
      <Avatar className="">
        <AvatarImage
          src={`https://api.dicebear.com/8.x/thumbs/svg?scale=75&seed=${username}`}
        />
        <AvatarFallback>{username.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <p className="text-base">@{username}</p>
    </Button>
  );
}

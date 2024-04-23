import { Form, useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { loader } from '~/routes/dashboard';
import { CommandItem } from './ui/command';

type userButtonProps = {
  username: string;
};

export default function UserCommandItem({ username }: userButtonProps) {
  const { myUsername } = useLoaderData<typeof loader>();

  if (username === myUsername) return null;

  return (
    <CommandItem value={username}>
      <Form method="post">
        <button
          className="h-full gap-4 w-full flex justify-start px-2 items-center"
          name="intent"
          value="newThread"
        >
          <Avatar className="">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/thumbs/svg?scale=75&seed=${username}`}
            />
            <AvatarFallback>{username.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <p className="text-base">@{username}</p>
        </button>
        <input type="hidden" name="myUsername" value={myUsername} />
        <input type="hidden" name="recipientUsername" value={username} />
      </Form>
    </CommandItem>
  );
}

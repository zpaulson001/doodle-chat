import { Form, useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { loader } from '~/routes/dashboard';
import { CommandItem } from './ui/command';

type userButtonProps = {
  username: string;
  picture: string | null;
};

export default function UserCommandItem({
  username,
  picture,
}: userButtonProps) {
  const { myUsername } = useLoaderData<typeof loader>();

  if (username === myUsername) return null;

  return (
    <CommandItem
      value={username}
      className="p-0 hover:bg-slate-100 active:bg-emerald-100 transition-colors"
    >
      <Form method="post" className="w-full">
        <button
          className="h-full w-full gap-4 flex px-4 py-1.5 items-center"
          name="intent"
          value="newThread"
        >
          <Avatar className="">
            <AvatarImage
              src={
                picture ||
                `https://api.dicebear.com/8.x/thumbs/svg?scale=75&seed=${username}`
              }
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

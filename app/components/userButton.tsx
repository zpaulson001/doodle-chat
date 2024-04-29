import { Form, useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { loader } from '~/routes/dashboard';

type userButtonProps = {
  username: string;
  picture: string | null;
};

export default function UserButton({ username, picture }: userButtonProps) {
  const { myUsername } = useLoaderData<typeof loader>();

  console.log(`User button picture: ${picture}`);

  if (username === myUsername) return null;

  return (
    <Form method="post">
      <Button
        variant="outline"
        className="h-16 gap-4 w-full flex px-8 justify-start"
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
      </Button>
      <input type="hidden" name="myUsername" value={myUsername} />
      <input type="hidden" name="recipientUsername" value={username} />
    </Form>
  );
}

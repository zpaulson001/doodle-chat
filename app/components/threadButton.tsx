import { NavLink, useLoaderData } from '@remix-run/react';
import { loader } from '~/routes/dashboard';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type ThreadArgs = {
  id: string;
  name?: string;
  picture?: string;
  members: string[];
};

export default function ThreadButton({
  id,
  name,
  picture,
  members,
}: ThreadArgs) {
  const { myUsername, userArr } = useLoaderData<typeof loader>();

  let threadContents = null;

  if (members.length > 2) {
    threadContents = (
      <>
        <Avatar className="">
          <AvatarImage
            src={`https://api.dicebear.com/8.x/thumbs/svg?scale=75&radius=50&seed=${name}`}
          />
          <AvatarFallback>{name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-base">{name || members}</p>
      </>
    );
  } else {
    const recipient = members.find((member) => member !== myUsername);

    const recipientIndex = userArr.findIndex(
      (user) => user.username === recipient
    );

    let recipientPic = null;

    if (recipientIndex > -1) {
      recipientPic = userArr[recipientIndex].picture;
    }

    threadContents = (
      <>
        <Avatar className="">
          <AvatarImage
            src={
              recipientPic ||
              `https://api.dicebear.com/8.x/thumbs/svg?scale=75&seed=${recipient}`
            }
          />
          <AvatarFallback>{recipient?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-base">@{recipient}</p>
      </>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className="h-16 gap-4 w-full flex px-8 justify-start"
    >
      <NavLink
        to={`/dashboard/${id}`}
        className="aria-[current=page]:bg-emerald-100"
      >
        {threadContents}
      </NavLink>
    </Button>
  );
}

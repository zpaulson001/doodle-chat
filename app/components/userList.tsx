import { useLoaderData } from '@remix-run/react';
import { ScrollArea } from './ui/scroll-area';
import { loader } from '~/routes/dashboard';
import UserButton from './userButton';

export default function UserList() {
  const { userArr } = useLoaderData<typeof loader>();

  return (
    <ScrollArea className="h-80">
      <div className="grid gap-2">
        {userArr.map((user) => {
          return (
            <UserButton
              key={user.username}
              username={user.username}
              picture={user.picture}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

import { useLoaderData } from '@remix-run/react';
import { ScrollArea } from './ui/scroll-area';
import { loader } from '~/routes/dashboard';
import ThreadButton from './threadButton';

export default function ThreadList() {
  const { threadArr } = useLoaderData<typeof loader>();

  return (
    <ScrollArea>
      <div className="grid gap-2">
        {threadArr.map((thread) => {
          return (
            <ThreadButton
              key={thread.id}
              id={thread.id}
              members={thread.members}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

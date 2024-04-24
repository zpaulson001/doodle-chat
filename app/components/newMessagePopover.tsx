import { SquarePen } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from './ui/command';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { loader } from '~/routes/dashboard';
import UserCommandItem from './userCommandItem';
import { useEffect, useState } from 'react';

export default function NewMessagePopOver() {
  const { userArr } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const { state: navState } = useNavigation();

  useEffect(() => {
    if (navState === 'loading' || navState === 'submitting') {
      setOpen(false);
    }
  }, [navState]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SquarePen className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Type a username..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {userArr.map((user) => {
                return (
                  <UserCommandItem
                    key={user.username}
                    username={user.username}
                  />
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import { ScrollArea } from './ui/scroll-area';

type ChatWindowProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function ChatWindow({ children, className }: ChatWindowProps) {
  return (
    <ScrollArea className={`w-full p-0 ${className}`}>
      <div className="w-full max-w-lg grid gap-4 justify-stretch items-end ">
        {children}
      </div>
      <div id="chat-window-bottom"></div>
    </ScrollArea>
  );
}

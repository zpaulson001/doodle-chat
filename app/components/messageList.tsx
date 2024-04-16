import { useEffect } from 'react';
import Message from './message';

type MessageListProps = {
  messageArr: {
    id: string;
    url: string;
    username: string;
  }[];
};

export default function MessageList({ messageArr }: MessageListProps) {
  useEffect(() => {
    document
      .getElementById('bottom-message')
      ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  const messageNodeArr = messageArr.map((message) => {
    return <Message key={message.id} url={message.url} />;
  });

  messageNodeArr.push(<div key={'last'} id="bottom-message"></div>);

  return messageNodeArr;
}

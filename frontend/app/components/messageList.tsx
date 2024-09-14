import { useEffect } from 'react';
import Message from './message';

type MessageListProps = {
  messageArr: {
    id: string;
    url: string;
    username: string;
  }[];
  myUsername: string;
};

export default function MessageList({
  messageArr,
  myUsername,
}: MessageListProps) {
  useEffect(() => {
    document
      .getElementById('bottom-message')
      ?.scrollIntoView({ behavior: 'instant', block: 'end' });
  });

  const messageNodeArr = messageArr.map((message) => {
    return (
      <Message
        key={message.id}
        id={message.id}
        url={message.url}
        username={message.username}
        myUsername={myUsername}
      />
    );
  });

  messageNodeArr.push(<div key={'last'} id="bottom-message"></div>);

  return messageNodeArr;
}

type MessageProps = {
  url: string;
  username: string;
  myUsername: string;
};

export default function Message({ url, username, myUsername }: MessageProps) {
  const isMe = myUsername === username;
  console.log(myUsername, username);

  return (
    <img
      className={`rounded-md flex-grow-0 ${isMe ? 'justify-self-end' : 'justify-self-start'}`}
      alt="user-drawing"
      src={url}
    />
  );
}

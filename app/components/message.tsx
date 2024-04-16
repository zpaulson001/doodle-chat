type MessageProps = {
  url: string;
  username: string;
  myUsername: string;
};

export default function Message({ url, username, myUsername }: MessageProps) {
  const isMe = myUsername === username;
  console.log(myUsername, username);

  return (
    <div className={`${isMe ? 'justify-self-end' : 'justify-self-start'}`}>
      {isMe ? null : <p>@{username}</p>}
      <img className={`rounded-md flex-grow-0`} alt="user-drawing" src={url} />
    </div>
  );
}

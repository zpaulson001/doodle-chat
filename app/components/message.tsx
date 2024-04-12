type MessageProps = {
  url: string;
};

export default function Message(props: MessageProps) {
  return (
    <img
      className="rounded-md flex-grow-0"
      alt="user-drawing"
      src={props.url}
    />
  );
}

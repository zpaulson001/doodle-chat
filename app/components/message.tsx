type MessageProps = {
  url: string;
};

export default function Message(props: MessageProps) {
  return <img className="rounded-md" alt="user-drawing" src={props.url} />;
}

import { useFetcher } from '@remix-run/react';
import { Trash2 } from 'lucide-react';

type MessageProps = {
  url: string;
  id: string;
  username: string;
  myUsername: string;
};

export default function Message({
  url,
  id,
  username,
  myUsername,
}: MessageProps) {
  const isMe = myUsername === username;

  const fetcher = useFetcher();

  function handleClick() {
    const formData = new FormData();

    formData.append('intent', 'deleteMessage');
    formData.append('id', id);

    fetcher.submit(formData, { method: 'POST' });
  }

  return (
    <div className="group">
      {isMe ? null : <p>@{username}</p>}
      <div
        className={`flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {isMe ? (
          <button
            className="hidden opacity-0 group-hover:opacity-100 group-hover:block p-3 rounded-full hover:text-red-400 transition-all"
            onClick={handleClick}
          >
            <Trash2 />
          </button>
        ) : null}
        <img
          className={`rounded-md flex-grow-0 shadow-sm`}
          alt="user-drawing"
          src={url}
        />
      </div>
    </div>
  );
}

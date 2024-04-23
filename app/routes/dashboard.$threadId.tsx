import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ChatWindow from '~/components/chatWindow';
import DrawingPad from '~/components/drawingPad';
import MessageList from '~/components/messageList';
import { getMessagesOfThread } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import { handleCreateMessage } from '~/utils/dashboard.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const messageArr = await getMessagesOfThread(params.threadId as string);

  return json({ username: user.username, messageArr });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const formData = await request.formData();

  await handleCreateMessage(user.username, formData, params.threadId as string);

  return null;
}

export default function Thread() {
  const { username, messageArr } = useLoaderData<typeof loader>();

  return (
    <>
      <ChatWindow className="border border-red-500">
        <MessageList messageArr={messageArr} myUsername={username} />
      </ChatWindow>
      <DrawingPad />
    </>
  );
}

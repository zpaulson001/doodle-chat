import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ChatWindow from '~/components/chatWindow';
import DrawingPad from '~/components/drawingPad';
import MessageList from '~/components/messageList';
import { deleteMessage, getMessagesOfThread, getThread } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import { handleCreateMessage } from '~/utils/dashboard.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const thread = await getThread(params.threadId as string);

  if (!thread) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  const messageArr = await getMessagesOfThread(params.threadId as string);

  return json({ username: user.username, messageArr });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const formData = await request.formData();

  const intent = formData.get('intent');

  switch (intent) {
    case 'sendMessage':
      await handleCreateMessage(
        user.username,
        formData,
        params.threadId as string
      );
      break;
    case 'deleteMessage':
      await deleteMessage(formData.get('id') as string);
      break;
  }

  return null;
}

export default function Thread() {
  const { username, messageArr } = useLoaderData<typeof loader>();

  return (
    <>
      <ChatWindow>
        <MessageList messageArr={messageArr} myUsername={username} />
      </ChatWindow>
      <DrawingPad />
    </>
  );
}

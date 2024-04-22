import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import DrawingPad from '~/components/drawingPad';
import Layout from '~/components/layout';
import MessageList from '~/components/messageList';
import SideBar from '~/components/sideBar';
import { Button } from '~/components/ui/button';
import { getAllUsers, getUsersThreads } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import { handleCreateMessage } from '~/utils/dashboard.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const userArr = await getAllUsers();

  const threadArr = await getUsersThreads(user.username);

  return json({ myUsername: user.username, userArr, threadArr });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const formData = await request.formData();

  const intent = formData.get('intent');

  if (!intent) {
    return null;
  }

  switch (intent) {
    case 'logout':
      await authenticator.logout(request, { redirectTo: '/login' });
      break;
    case 'sendMessage':
      await handleCreateMessage(user.id, formData);
      break;
  }

  return json('done');
}

export default function DashboardPage() {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const { myUsername, threadArr } = useLoaderData<typeof loader>();
  const path = useResolvedPath('./stream');
  const data = useEventSource(path.pathname);
  const revalidator = useRevalidator();

  // function scrollToBottom() {
  //   messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  //   messageWindowRef.current?.scroll({
  //     top: messageWindowRef.current.scrollHeight,
  //     behavior: 'smooth',
  //   });
  // }

  useEffect(() => {
    revalidator.revalidate();
    // scrollToBottom();
  }, [data]);

  return (
    <Layout>
      <div className="flex gap-4 h-full max-w-4xl mx-auto border border-red-500 p-4">
        <SideBar className="w-80" />
        <div className="grid gap-4 flex-grow justify-items-center content-end border border-red-500">
          <div
            ref={messageWindowRef}
            className="w-full max-w-lg grid gap-4 justify-stretch items-end overflow-x-auto"
          >
            <div id="chat-window-bottom" ref={messageEndRef}></div>
          </div>
          <DrawingPad />
        </div>
      </div>
    </Layout>
  );
}

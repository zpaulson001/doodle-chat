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
import { Button } from '~/components/ui/button';
import { readAllMessages } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import { handleCreateMessage } from '~/utils/dashboard.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const messageArr = await readAllMessages();

  return json({ myUsername: user.username, messageArr });
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
  const { myUsername, messageArr } = useLoaderData<typeof loader>();
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
    <Layout className="grid p-4 gap-4 justify-center justify-items-center content-end">
      <div className="fixed top-0 left-0 p-4">
        <h1>{`Dashboard`}</h1>
        <Form method="post">
          <Button name="intent" value="logout">
            Log out
          </Button>
        </Form>
      </div>
      <div
        ref={messageWindowRef}
        className="w-[600px] grid gap-2 justify-stretch items-end overflow-x-auto"
      >
        <MessageList messageArr={messageArr} myUsername={myUsername} />
        <div id="chat-window-bottom" ref={messageEndRef}></div>
      </div>
      <DrawingPad />
    </Layout>
  );
}

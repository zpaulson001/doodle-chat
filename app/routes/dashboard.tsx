import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from '@remix-run/node';
import { Outlet, useResolvedPath, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import Layout from '~/components/layout';
import SideBar from '~/components/sideBar';
import { getAllUsers, getUsersThreads } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import { handleCreateNewThread } from '~/utils/dashboard.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Doodle Chat | Dashboard' }];
};

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
    case 'newThread':
      return await handleCreateNewThread(formData);
      break;
  }

  return json('done');
}

export default function DashboardPage() {
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
      <div className="flex gap-4 h-full max-w-4xl mx-auto p-4">
        <SideBar className="w-80" />
        <div className="grid gap-4 flex-grow justify-items-center content-end">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}

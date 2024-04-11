import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  NodeOnDiskFile,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import DrawingPad from '~/components/drawingPad';
import Layout from '~/components/layout';
import Message from '~/components/message';
import { Button } from '~/components/ui/button';
import { createMessage, readMessages } from '~/db/models';
import { authenticator } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const messageArr = await readMessages(user.id);

  return json({ messageArr });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
        filter({ contentType }) {
          return contentType.includes('image');
        },
        directory: './public/img',
        avoidFileConflicts: false,
        file({ filename }) {
          return filename;
        },
      }),
      unstable_createMemoryUploadHandler()
    )
  );

  const drawing = formData.get('drawing') as NodeOnDiskFile;

  const drawingPath = drawing.getFilePath();

  console.log(drawing);
  console.log(drawingPath);

  switch (formData.get('intent') as string) {
    case 'logout':
      await authenticator.logout(request, { redirectTo: '/login' });
      break;
    case 'sendMessage':
      if (drawing !== null) {
        await createMessage(user.id, drawingPath);
      }
      return 'image created';
      break;
  }

  return json(formData);
}

type CreateMessageNodeArgs = {
  id: string;
  url: string;
  username: string;
}[];

export function createMessageNodes(messageArr: CreateMessageNodeArgs) {
  const messageNodeArr = messageArr.map((message) => {
    return <Message key={message.id} url={message.url} />;
  });

  return messageNodeArr;
}

export default function DashboardPage() {
  const { messageArr } = useLoaderData<typeof loader>();

  const messageNodeArr = createMessageNodes(messageArr);

  return (
    <Layout className="flex flex-col justify-center items-center">
      <div className="fixed top-0 left-0 p-4">
        <h1>{`Dashboard`}</h1>
        <Form method="post">
          <Button name="intent" value="logout">
            Log out
          </Button>
        </Form>
      </div>
      <div>{messageNodeArr}</div>
      <DrawingPad />
    </Layout>
  );
}

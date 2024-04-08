import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import Layout from '~/components/layout';
import { Button } from '~/components/ui/button';
import { authenticator } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return user;
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: '/login' });
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <Layout>
      <h1>{`${data.username}'s Dashboard`}</h1>
      <Form method="post">
        <Button type="submit">Log out</Button>
      </Form>
    </Layout>
  );
}

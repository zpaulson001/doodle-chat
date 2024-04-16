import { redirect } from '@remix-run/node';
import Layout from '~/components/layout';

export async function loader() {
  return redirect('/login');
}

export default function Index() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold underline">look out world 👀</h1>
    </Layout>
  );
}

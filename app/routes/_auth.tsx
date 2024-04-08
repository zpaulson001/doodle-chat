import { Outlet } from '@remix-run/react';
import Layout from '~/components/layout';

export default function AuthPage() {
  return (
    <Layout className="flex flex-col items-center justify-center">
      <Outlet />
    </Layout>
  );
}

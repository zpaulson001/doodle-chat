import Chat from '~/components/chat';
import Layout from '~/components/layout';

export default function PlaygroundPage() {
  return (
    <Layout className="flex flex-col justify-center items-center">
      <Chat />
    </Layout>
  );
}

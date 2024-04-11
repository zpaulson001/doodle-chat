import { ActionFunctionArgs } from '@remix-run/node';
import DrawingPad from '~/components/drawingPad';
import Layout from '~/components/layout';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData.get('drawing'));
  return null;
}

export default function PlaygroundPage() {
  return (
    <Layout className="flex flex-col justify-center items-center">
      <DrawingPad />
    </Layout>
  );
}

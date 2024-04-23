import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { authenticator } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.authenticate('user-pass', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  });

  const formData = await request.formData();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const errors = {};

  return json({ user, errors });
}

export default function LoginPage() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to Dwyzzi 🫨</CardTitle>
        <CardDescription>
          {`New to Dwyzzi?`}
          <Link to="/signup">
            <Button variant="link">Create an account.</Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" method="post">
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input id="username" name="username" placeholder="" />
              </div>
            </div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="login-form" type="submit" className="w-full">
          Log in
        </Button>
      </CardFooter>
    </Card>
  );
}

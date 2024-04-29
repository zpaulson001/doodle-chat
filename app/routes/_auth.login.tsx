import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';
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

type Errors = {
  username?: string;
  password?: string;
  user?: string;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Doodle Chat | Login' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // return await authenticator.isAuthenticated(request, {
  //   successRedirect: '/dashboard',
  // });
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const errors: Errors = {};

  const formData = await request.clone().formData();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username.length < 5) {
    errors.username = 'Username must be at least 5 characters long';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (errors.username || errors.password) {
    return json({ errors });
  }

  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/dashboard',
      throwOnError: true,
    });
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      // here the error is related to the authentication process
      errors.user = error.message;
      return json({ errors });
    }
    console.error(error);
    // here the error is a generic error that another reason may throw
  }

  return 'something broke';
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to Doodle Chat ✏️</CardTitle>
        <CardDescription>
          {`New to Doodle Chat?`}
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
                <p className="text-sm text-red-500 mt-2">
                  {actionData?.errors?.username}
                </p>
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
                <p className="text-sm text-red-500 mt-2">
                  {actionData?.errors?.password}
                </p>
              </div>
            </div>
          </div>
        </form>
        <p className="text-sm text-red-500 mt-2">{actionData?.errors?.user}</p>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Button form="login-form" type="submit" className="w-full">
          Log in
        </Button>
        <form method="post">
          <input type="hidden" name="username" value="demouser" />
          <input type="hidden" name="password" value="demouserpassword" />
          <Button type="submit" className="w-full" variant="outline">
            Demo Account
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

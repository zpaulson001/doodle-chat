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
import { createUser, getUser } from '~/db/models';
import { authenticator } from '~/utils/auth.server';

type Errors = {
  username?: string;
  password?: string;
  user?: string;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Dwyzzi | Sign up' }];
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

  const existingUser = await getUser(username);

  if (existingUser) {
    errors.user = `User "${username}" already exists. Please log in.`;
    return json({ errors });
  }

  const user = await createUser(username, password);

  if (!user) {
    errors.user = 'Failed to create new user.';
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
      return json({ errors });
      // errors.user = error.message;
    }
    // here the error is a generic error that another reason may throw
  }
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>();
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          {`Already have one?`}
          <Link to="/login">
            <Button variant="link">Log in.</Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" method="post">
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
      <CardFooter>
        <Button type="submit" form="signup-form" className="w-full">
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}

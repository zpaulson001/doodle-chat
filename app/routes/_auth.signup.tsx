import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
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
import { createUser } from '~/db/models';
import { authenticator } from '~/utils/auth.server';
import * as argon2 from 'argon2';

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.clone().formData();
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  const hashedPassword = await argon2.hash(password);

  const user = await createUser(username, hashedPassword);

  if (!user) {
    throw new Error();
  }

  return await authenticator.authenticate('user-pass', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/index',
  });
}

export default function SignupPage() {
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
        <Button type="submit" form="signup-form" className="w-full">
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}

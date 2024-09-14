import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';

import type { LinksFunction, MetaFunction } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Button } from './components/ui/button';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const meta: MetaFunction = () => {
  return [{ title: 'Doodle Chat' }];
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oops 🤦‍♂️</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-emerald-100 grid justify-center content-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Oops 🤦‍♂️</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-slate-600">
              It appears as though something has malfunctioned. Please accept
              this gif as a token of our regret.
            </p>
            <p className="text-red-400">{`Error: ${error.status} ${error.statusText}`}</p>

            <img
              className="rounded-md"
              alt="A red panda burying his face in his tail"
              src="https://images.squarespace-cdn.com/content/v1/5eff72dcc0ca0d3ec54f0b89/491c097e-eb2b-496f-92ba-ba78a367f7e3/Screen+Recording+2024-04-21+at+8.25.09%E2%80%AFAM.gif?format=300w"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>
              <Link to="/login">Back to Login</Link>
            </Button>
            <Button>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-emerald-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

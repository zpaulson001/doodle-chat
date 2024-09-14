import { FormStrategy } from 'remix-auth-form';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { sessionStorage } from '~/utils/session.server';
import { db } from '~/db/db';
import * as argon2 from 'argon2';

type User = {
  id: string;
  username: string;
  passHash: string;
};

const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  const user = await db.user.findUnique({
    where: { username: username },
    select: {
      id: true,
      username: true,
      passHash: true,
    },
  });

  if (!user) {
    throw new AuthorizationError(
      `We tried, but we couldn't find ya. Please create an account.`
    );
  }

  const passwordsMatch = await argon2.verify(user.passHash, password);

  if (!passwordsMatch) {
    throw new AuthorizationError('Invalid password');
  }

  return user;
});

authenticator.use(formStrategy, 'user-pass');

export { authenticator };

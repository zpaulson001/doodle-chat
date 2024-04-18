import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const db = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

// import { PrismaClient } from '@prisma/client';

// export const db = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

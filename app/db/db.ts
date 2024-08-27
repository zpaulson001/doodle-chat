import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: `${process.env.DATABASE_URL}`,
  authToken: `${process.env.AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const db = new PrismaClient({
  adapter,
  // Uncomment following line to see logs made by the Prisma client
  // log: ['query', 'info', 'warn', 'error'],
});

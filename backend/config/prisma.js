import { PrismaClient } from '@prisma/client';

// A single shared Prisma Client instance — reused across the whole app
// instead of creating a new one per request/import, which would exhaust
// the database's connection pool.
const prisma = new PrismaClient();

export default prisma;
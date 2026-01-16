import { PrismaClient } from '@prisma/client';
import { validateEnvironment, validateDatabaseConnection } from './env';

// Validate environment variables before creating Prisma client
validateEnvironment();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Validate database connection on startup
if (typeof window === 'undefined') {
  // Only run on server side
  validateDatabaseConnection().catch(error => {
    console.error('Database validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  });
}
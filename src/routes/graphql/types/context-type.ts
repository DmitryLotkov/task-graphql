import { PrismaClient } from '@prisma/client';
import { createLoaders } from '../create-loaders.js';

export type Context = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
};

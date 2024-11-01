import { PrismaClient } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (app) => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  prisma.$on('query', (event) => {
    app.log.info(event, 'Database Query (ORM)');
  });

  prisma.$on('info', (event) => {
    app.log.info(event.message);
  });

  prisma.$on('warn', (event) => {
    app.log.warn(event.message);
  });

  prisma.$on('error', (event) => {
    app.log.warn(event.message);
  });

  await prisma.$connect();

  app.decorate('prisma', prisma);

  app.addHook('onClose', async (server) => {
    await server.prisma.$disconnect();
  });
}, {
  name: 'prisma-orm-connector',
});

export default prismaPlugin;

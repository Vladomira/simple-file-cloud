import type { RouteHandler } from 'fastify';

const handler: RouteHandler = async function (request, reply) {
  // this.config
  // this.prisma
  // this.requestContext
  // this.jwt
  const [err, usersCount] = await this.to(this.prisma.user.count());

  if (err) {
    throw err;
  }

  return {
    usersCount,
  };
}

export default {
  method: 'GET',
  url: '/',
  handler,
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          usersCount: {
            type: 'number',
          }
        },
      },
      '5xx': {
        $ref: 'HttpError',
      },
    },
  },
};

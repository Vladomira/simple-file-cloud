import fastifyAuth from '@fastify/auth';
import fastifyEnv from '@fastify/env';
import fastifyJWT from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyRequestContext from '@fastify/request-context';
import fastifySensible from '@fastify/sensible';
import fastify from 'fastify';
import fastifyEnvSchema from '../configs/env-schema.js';
import fastifyConfig from '../configs/fastify.js';
import prismaPlugin from './plugins/prisma.js';
import routesPlugin from './plugins/routes.js';

const app = fastify(fastifyConfig);

app.register(fastifyEnv, {
  confKey: 'config',
  schema: fastifyEnvSchema,
});

app.register(fastifySensible, {
  sharedSchemaId: 'HttpError',
});

app.register(fastifyRequestContext, {
  hook: 'onRequest',
  defaultStoreValues(request) {
    return {};
  },
});

app.register(fastifyMultipart, {
  attachFieldsToBody: 'keyValues',
  sharedSchemaId: '#filesSchema',
});

app.register(fastifyJWT, {
  secret: 'supersecret',
  decode: {
    checkTyp: 'JWT',
  },
  sign: {
    algorithm: 'HS512',
    iss: 'api.example.tld',
  },
  verify: {
    allowedIss: 'api.example.tld',
    algorithms: ['HS512'],
  },
  trusted(request, decodedToken) {
    // TODO: add database check
    return true;
  }
});

app.register(fastifyAuth, {
  defaultRelation: 'and',
});

app.register(prismaPlugin);
app.register(routesPlugin);

export default app;

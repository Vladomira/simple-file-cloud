import type { JSONSchemaType } from 'ajv';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production';
  HOST: string;
  PORT: string;
  DATABASE_URL: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvironmentVariables;
  }
}

export default {
  type: 'object',
  additionalProperties: true,
  required: ['DATABASE_URL'],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
      enum: ['development', 'production'],
    },
    PORT: {
      type: 'string',
      default: '3000',
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    DATABASE_URL: {
      type: 'string',
    },
  },
} satisfies JSONSchemaType<EnvironmentVariables>;

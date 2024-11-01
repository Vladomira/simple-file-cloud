import type { FastifyServerOptions } from 'fastify';
import { hostname } from 'node:os';
import { env, version as nodeVersion } from 'node:process';
import { fileURLToPath } from 'node:url';
import type { PrettyOptions } from 'pino-pretty';

const IS_DEVELOPMENT_ENV = env.NODE_ENV !== 'production';

function generateRedactionPaths(redactionFields: string[]): string[] {
  const NESTING_LEVELS = 5;
  return redactionFields.flatMap((fieldName) =>
    Array.from(
      { length: NESTING_LEVELS },
      (_, i) => '*.'.repeat(i) + fieldName,
    ),
  );
}

export const prettyTransportOptions: PrettyOptions = {
  messageKey: 'message',
  levelKey: 'level',
  translateTime: 'SYS:HH:MM:ss:l',
  errorLikeObjectKeys: ['err', 'error'],
  ignore: [
    'serviceContext',
    'pid',
    'hostname',
    'nodeVersion',
    'req',
    'res',
    'reqId',
    'responseTime',
  ].join(','),
};

export default {
  messageKey: 'message',
  errorKey: 'error',
  level: IS_DEVELOPMENT_ENV ? 'debug' : 'info',
  transport: IS_DEVELOPMENT_ENV ? {
    target: fileURLToPath(import.meta.resolve('./pino-pretty-transport')),
    options: prettyTransportOptions,
  } : undefined,
  base: {
    nodeVersion,
    pid: process.pid,
    hostname: hostname(),
    serviceContext: {
      service: 'backend',
    },
  },
  redact: {
    censor: '[Redacted]',
    paths: [
      'req.headers.authorization',
      ...generateRedactionPaths([
        'email',
        'password',
      ]),
    ],
  },
} satisfies FastifyServerOptions['logger'];

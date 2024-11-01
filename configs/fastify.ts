import type { FastifyServerOptions } from 'fastify';
import { randomUUID } from 'node:crypto';
import loggerConfig from './logger.js';

export default {
  ignoreTrailingSlash: true,
  onProtoPoisoning: 'remove',
  onConstructorPoisoning: 'remove',
  return503OnClosing: true,
  connectionTimeout: 10_000, // 10 seconds
  requestTimeout: 30_000, // 30 seconds
  pluginTimeout: 10_000, // 10 seconds
  genReqId: () => randomUUID(),
  logger: loggerConfig,
  ajv: {
    customOptions: {
      // check all rules collecting all errors
      allErrors: false,
      // enable formats validation
      validateFormats: true,
      // validate numbers strictly, failing validation for NaN and Infinity
      strictNumbers: true,
    },
  },
} satisfies FastifyServerOptions;

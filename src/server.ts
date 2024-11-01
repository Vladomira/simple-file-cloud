import process from 'node:process';
import app from './app.js';

await app.ready();

const { HOST, PORT, NODE_ENV } = app.config;

const a = await app.listen({
  port: parseInt(PORT, 10),
  host: HOST,
});

if (NODE_ENV === 'development') {
  app.log.info('Server Routes:');
  app.log.info(app.printRoutes({ includeHooks: false, commonPrefix: false }));
  app.log.info(app.getSchemas(), 'Server Validation Schemas');
}

async function handleGracefulShutdown(signal: NodeJS.Signals | Error) {
  if (signal instanceof Error) {
    app.log.error(signal, 'Uncaught exception shutdown');
  } else {
    app.log.info(`Server is gracefully shut down with "${signal}"`);
  }

  await app.close();

  const shutdownSignal = typeof signal === 'string' ? signal : 'SIGTERM';
  process.kill(process.pid, shutdownSignal);
}

process.once('SIGINT', handleGracefulShutdown);
process.once('SIGTERM', handleGracefulShutdown);
process.once('SIGUSR1', handleGracefulShutdown);
process.once('SIGUSR2', handleGracefulShutdown);
process.once('uncaughtException', handleGracefulShutdown);

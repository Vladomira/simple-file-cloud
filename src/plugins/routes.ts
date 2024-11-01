import type { FastifyPluginAsync, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import { readdir } from 'node:fs/promises';
import { join as joinPath } from 'node:path';

const routesDirPath = new URL('../routes', import.meta.url);

const routesPlugin: FastifyPluginAsync = fp(async (app) => {
  const routesDirEntries = await readdir(routesDirPath, {
    withFileTypes: true,
    recursive: true,
    encoding: 'utf-8',
  });

  await Promise.all(
    routesDirEntries.map(async (entry) => {
      if (entry.isDirectory()) return undefined;
      if (entry.name.includes('.test')) return undefined;

      const routeModule = await import(joinPath(entry.path, entry.name));

      if (routeModule?.default == null) {
        throw new Error('Route file must use default export');
      }

      if (Array.isArray(routeModule.default)) {
        routeModule.default.forEach((route: RouteOptions) => {
          app.route(route);
        });
      } else {
        app.route(routeModule.default);
      }
    })
  );
}, {
  name: 'routes-loader',
});

export default routesPlugin;

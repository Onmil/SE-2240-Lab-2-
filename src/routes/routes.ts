import { Express } from 'express';
import fs from 'fs';
import path from 'path';

export function registerRoutes(app: Express) {
  const routesPath = __dirname;

  fs.readdirSync(routesPath).forEach((file) => {
    if (
      file === 'index.ts' ||
      file === 'index.js' ||
      !file.endsWith('.ts') && !file.endsWith('.js')
    ) {
      return;
    }

    const routeName = file.replace(/\.(ts|js)$/, '');
    const route = require(path.join(routesPath, file));

    if (route.router) {
      app.use(`/${routeName}`, route.router);
      console.log(`📦 Loaded route: /${routeName}`);
    }
  });
}

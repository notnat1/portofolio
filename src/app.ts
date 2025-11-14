import express, { Express } from 'express';
import { Queries } from './database/queries';
import { Middleware } from './middleware';
import { makeHealthRoutes } from './routes/health';
import { makePeopleRoutes } from './routes/people';
import { makeProjectsRoutes } from './routes/projects';
import { makeContactRoutes } from './routes/contact';

export interface AppContext {
  queries: Queries;
  middleware: Middleware;
}

export function makeApp(ctx: AppContext): Express {
  const app = express();
  app.use(express.json());
  app.use(express.static('public'));
  app.use(ctx.middleware.logger);

  app.use('/health', makeHealthRoutes(ctx));
  app.use('/people', makePeopleRoutes(ctx));
  app.use('/api/projects', makeProjectsRoutes(ctx));
  app.use('/api/contact', makeContactRoutes(ctx));

  app.use(ctx.middleware.routeNotFound);
  app.use(ctx.middleware.errorHandler);

  return app;
}

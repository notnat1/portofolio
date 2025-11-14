import { Router } from 'express';
import { AppContext } from '../app';

export const makeProjectsRoutes = (ctx: AppContext) => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const projects = await ctx.queries.getAllProjects();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

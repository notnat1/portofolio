import { Router } from 'express';
import { AppContext } from '../app';
import { ContactMessage } from '../database/types';

export const makeContactRoutes = (ctx: AppContext) => {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const { full_name, email, message } = req.body;
      const contactMessage = await ctx.queries.addContactMessage({ full_name, email, message });
      res.status(201).json(contactMessage);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

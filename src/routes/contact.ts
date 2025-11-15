import { Router, Request, Response, NextFunction } from 'express';
import { AppContext } from '../app';
import { sendContactEmail } from '../services/email';

export const makeContactRoutes = () => {
  const router = Router();

  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { full_name, email, message } = req.body;

      if (!full_name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: full_name, email, message' });
      }

      await sendContactEmail({ fullName: full_name, email, message });
      
      res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

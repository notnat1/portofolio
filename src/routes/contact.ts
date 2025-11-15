import { Router } from 'express';
import { AppContext } from '../app';
import { sendContactEmail } from '../services/email';

export const makeContactRoutes = (ctx: AppContext) => {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const { full_name, email, message } = req.body;

      if (!full_name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: full_name, email, message' });
      }

      await sendContactEmail({ fullName: full_name, email, message });
      
      res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
    } catch (error) {
      console.error('Error in contact route:', error);
      res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
    }
  });

  return router;
};

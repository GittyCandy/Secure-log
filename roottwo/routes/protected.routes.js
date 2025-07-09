import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
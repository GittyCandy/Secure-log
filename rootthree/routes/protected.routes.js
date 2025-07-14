import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      is_buyer: req.user.is_buyer,
      is_seller: req.user.is_seller,
      is_admin: req.user.is_admin
    }
  });
});

router.get('/check-admin', (req, res) => {
  res.json({
    success: true,
    is_admin: req.user.is_admin
  });
});

export default router;
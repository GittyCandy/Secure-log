import { Router } from 'express';
import {
  register,
  login,
  logout,
  getDashboard
} from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', authenticate, getDashboard);

export default router;
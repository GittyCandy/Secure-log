import { Router } from 'express';
import {
  register,
  login,
  logout,
  getDashboard,
  getAdminDashboard
} from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', authenticate, getDashboard);
router.get('/admin/dashboard', authenticate, adminMiddleware, getAdminDashboard);

export default router;
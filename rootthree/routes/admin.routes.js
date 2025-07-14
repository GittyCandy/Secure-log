import { Router } from 'express';
import adminMiddleware from '../middlewares/admin.middleware.js';
import User from '../models/user.model.js';

const router = Router();

router.use(adminMiddleware);

router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

export default router;
import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAllUsers,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// PUBLIC
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser); // demo / unauthenticated
router.get('/', protect, getAllUsers);

// PROTECTED
router.put('/me', protect, updateProfile);        // update any field except email
router.put('/password', protect, changePassword); // verify old pw → set new pw

export default router;

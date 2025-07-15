import express from 'express';
import { getAdminDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/admin-dashboard', getAdminDashboard);

export default router;

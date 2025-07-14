import express from 'express';
import {
  searchAccounts,
  getSimulationStatus,
  setSimulationStatus
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/accounts', searchAccounts);
router.get('/accounts/:id/simulation-status', getSimulationStatus);
router.post('/accounts/:id/simulation', setSimulationStatus);

export default router;
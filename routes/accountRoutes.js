import express from 'express';
import InvestmentAccount from '../models/investmentAccountModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Get all users with investment accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await InvestmentAccount.find().populate('user', 'name email createdAt');
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

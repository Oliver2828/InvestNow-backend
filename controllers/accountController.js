// controllers/accountController.js
import InvestmentAccount from '../models/InvestmentAccount.js';
import User from '../models/User.js';

export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await InvestmentAccount.find().populate('user', 'name');

    const formatted = accounts.map((acc) => ({
      id: acc._id,
      name: acc.user?.name || 'Unknown',
      amount: acc.balance,
      status: acc.status || 'Active', // fallback if status isn't stored
      dateRegistered: acc.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

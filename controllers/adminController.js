import InvestmentAccount from '../models/InvestmentAccount.js';
import User from '../models/userModel.js';

// Search accounts by name or email
export const searchAccounts = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (!search) return res.json({ accounts: [] });

    // Find users by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }).select('_id name email');

    // Find accounts for those users
    const accounts = await InvestmentAccount.find({
      user: { $in: users.map(u => u._id) }
    }).populate('user', 'name email');

    res.json({
      accounts: accounts.map(acc => ({
        id: acc._id,
        name: acc.user.name,
        email: acc.user.email,
        type: acc.type,
        balance: acc.balance || 0,
        simulationActive: acc.simulationActive || false
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Get simulation status for an account
export const getSimulationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await InvestmentAccount.findById(id).lean();
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ simulationActive: account.simulationActive || false });
  } catch (err) {
    next(err);
  }
};

// Start/Pause simulation for an account
export const setSimulationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const account = await InvestmentAccount.findById(id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.simulationActive = !!active;
    await account.save();

    res.json({ message: 'Simulation status updated', simulationActive: account.simulationActive });
  } catch (err) {
    next(err);
  }
};
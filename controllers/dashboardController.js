import User from '../models/userModel.js';
import InvestmentAccount from '../models/InvestmentAccount.js';

export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const accountUpdates = await User.countDocuments({ updatedAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    const activeInvestments = await InvestmentAccount.countDocuments({ simulationActive: true });
    const newRegistrations = await User.countDocuments({ createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    const pendingVerifications = await User.countDocuments({ isVerified: false });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    const recentActivities = recentUsers.map((user, index) => ({
      id: index + 1,
      user: user.name,
      action: "Registered account",
      time: "Recently"
    }));

    res.json({
      totalUsers,
      accountUpdates,
      activeInvestments,
      newRegistrations,
      pendingVerifications,
      recentActivities
    });
  } catch (err) {
    next(err);
  }
};

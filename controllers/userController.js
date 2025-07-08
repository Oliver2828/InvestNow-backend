import User from '../models/User.js';
import InvestmentAccount from '../models/InvestmentAccount.js';

// Dummy profile images for accounts
const accountImages = {
  Savings: 'https://randomuser.me/api/portraits/men/1.jpg',
  Retirement: 'https://randomuser.me/api/portraits/women/1.jpg',
  Stocks: 'https://randomuser.me/api/portraits/men/2.jpg'
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists.' });

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      password,
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    // Create 3 investment accounts
    const accountTypes = ['Savings', 'Retirement', 'Stocks'];
    const accounts = await Promise.all(accountTypes.map(type =>
      InvestmentAccount.create({
        user: user._id,
        type,
        profileImage: accountImages[type]
      })
    ));

    user.accounts = accounts.map(acc => acc._id);
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      accounts
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('accounts');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      accounts: user.accounts
    });
  } catch (err) {
    next(err);
  }
};


export const getCurrentUser = async (req, res, next) => {
  try {
    // You may use req.user if you have authentication middleware
    // For demo, let's fetch by email from query or body (not secure, just for demo)
    const email = req.query.email || req.body.email;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch accounts and balances
    const accounts = await InvestmentAccount.find({ user: user._id }).lean();
    res.json({
      name: user.name,
      email: user.email,
      accounts: accounts.map(acc => ({
        type: acc.type,
        balance: acc.balance || 0
      }))
    });
  } catch (err) {
    next(err);
  }
};
import User from '../models/userModel.js';
import InvestmentAccount from '../models/InvestmentAccount.js';
import { generateToken } from '../utils/generateToken.js';

// -----------------------------------------------------------------------------
// DUMMY PROFILE IMAGES FOR THE 3 STARTER ACCOUNTS
// -----------------------------------------------------------------------------
const accountImages = {
  Savings: 'https://randomuser.me/api/portraits/men/1.jpg',
  Retirement: 'https://randomuser.me/api/portraits/women/1.jpg',
  Stocks: 'https://randomuser.me/api/portraits/men/2.jpg',
};

// -----------------------------------------------------------------------------
// REGISTER
// -----------------------------------------------------------------------------
export const registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists.' });

    // Only allow admin role if explicitly set and you want to allow it
    const userRole = role === 'admin' ? 'admin' : 'user';

    // 1) create user
    const user = await User.create({
      name,
      phone,
      email,
      password,
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: userRole
    });

    // ...existing account creation code...

    res.status(201).json({
      token: generateToken(user._id), // <‑‑ JWT
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role, // <-- Include role in response
      accounts,
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------------------------------------
// LOGIN
// -----------------------------------------------------------------------------
// Return role in login response
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('accounts');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id), // <‑‑ JWT
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role, // <-- Include role in response
      accounts: user.accounts,
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------------------------------------
// GET CURRENT USER (UNAUTHENTICATED DEMO ENDPOINT)
// -----------------------------------------------------------------------------
export const getCurrentUser = async (req, res, next) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accounts = await InvestmentAccount.find({ user: user._id }).lean();
    res.json({
      name: user.name,
      email: user.email,
      accounts: accounts.map((acc) => ({
        type: acc.type,
        balance: acc.balance || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------------------------------------
// UPDATE PROFILE  (ALL FIELDS EXCEPT EMAIL)
// -----------------------------------------------------------------------------
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('accounts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const blocked = [
      'email',
      '_id',
      'password',
      'accounts',
      'createdAt',
      'updatedAt',
    ];

    Object.keys(req.body).forEach((key) => {
      if (!blocked.includes(key)) user[key] = req.body[key];
    });

    await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email, // unchanged
        phone: user.phone,
        profileImage: user.profileImage,
        accounts: user.accounts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------------------------------------
// CHANGE PASSWORD
// -----------------------------------------------------------------------------
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    user.password = newPassword; // will be hashed by pre‑save hook
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// -----------------------------------------------------------------------------
// GET ALL USERS — For Admin or Dashboard View
// -----------------------------------------------------------------------------
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('accounts');

    res.json(users); // ✅ Make sure this line returns users directly
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};



 
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) throw new Error('No token');
    const { id } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorised' });
  }
};

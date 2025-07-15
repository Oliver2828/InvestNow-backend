import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentAccount' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // <-- Add role
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }, // <-- Add status
  simulationActive: { type: Boolean, default: false } // <-- Add simulation flag for user
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password check method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
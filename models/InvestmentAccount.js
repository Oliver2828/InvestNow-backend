import mongoose from 'mongoose';

const investmentAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Savings', 'Retirement', 'Stocks'], required: true },
  balance: { type: Number, default: 0 },
  profileImage: { type: String, default: '' }
}, { timestamps: true });

const InvestmentAccount = mongoose.model('InvestmentAccount', investmentAccountSchema);
export default InvestmentAccount;  
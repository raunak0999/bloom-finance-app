import mongoose, { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  user: Types.ObjectId;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

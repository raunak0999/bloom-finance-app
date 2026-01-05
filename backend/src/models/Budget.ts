import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  createdAt: Date;
}

const BudgetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  month: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;

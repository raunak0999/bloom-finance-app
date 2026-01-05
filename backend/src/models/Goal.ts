import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
}

const GoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);

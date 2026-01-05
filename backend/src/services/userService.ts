import { Types } from 'mongoose';
import User from '../models/User';
import { Goal } from '../models/Goal';
import Transaction from '../models/Transaction';

export interface UserProfile {
  income: number;
  expenses: Record<string, number>;
  goals: string[];
}

export const getUserById = async (id?: string | null) => {
  if (!id) return null;
  if (!Types.ObjectId.isValid(id)) return null;
  return User.findById(id).select('-password').lean();
};

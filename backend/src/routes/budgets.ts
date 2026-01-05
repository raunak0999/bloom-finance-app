import express from 'express';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all budgets for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let budgets = await Budget.find({ userId: req.userId! }).sort({ month: -1 });

    // Seed test data if no budgets exist
    if (budgets.length === 0) {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const testBudgets = [
        { userId: req.userId!, category: 'Food', limit: 5000, month: currentMonth },
        { userId: req.userId!, category: 'Rent', limit: 8000, month: currentMonth },
        { userId: req.userId!, category: 'Shopping', limit: 2000, month: currentMonth }
      ];
      budgets = await Budget.insertMany(testBudgets);
    }

    const transactions = await Transaction.find({ userId: req.userId!, type: 'expense' });

    // Calculate spent for each budget
    const budgetsWithSpent = budgets.map(budget => {
      const spent = transactions
        .filter(t => {
          const transactionMonth = t.date.toISOString().slice(0, 7); // YYYY-MM
          return t.category === budget.category && transactionMonth === budget.month;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...budget.toObject(),
        spent
      };
    });

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create new budget
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = new Budget({
      userId: req.userId!,
      category,
      limit,
      month
    });
    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update budgets (bulk update)
router.put('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { categories } = req.body;
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Categories array is required' });
    }

    // Get current month to only update budgets for this month
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Delete existing budgets for the user for current month only
    await Budget.deleteMany({ userId: req.userId!, month: currentMonth });

    // Create new budgets
    const newBudgets = categories.map(cat => ({
      userId: req.userId!,
      category: cat.category,
      limit: cat.limit,
      month: cat.month || currentMonth
    }));

    const budgets = await Budget.insertMany(newBudgets);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budgets' });
  }
});

// Delete budget
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export default router;

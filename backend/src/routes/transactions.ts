import express from 'express';
import Transaction from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/auth';



const router = express.Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    console.log('🔍 Searching user:', req.user.id);
    
    // Test ALL possible fields
    const transactions = await Transaction.find({
      $or: [
        { user: req.user.id },
        { userId: req.user.id },
        { user: req.user._id },
        { userId: req.user._id }
      ]
    }).sort({ date: -1 });
    
    console.log('✅ Found:', transactions.length, 'transactions');
    res.json(transactions);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Add new transaction
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);
    const { amount, type, category, description, date } = req.body;
    if (!amount || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.userId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;

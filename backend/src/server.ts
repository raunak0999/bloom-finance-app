import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from './models/User';
import investmentRoutes from './routes/investments';
import transactionRoutes from './routes/transactions';
import budgetRoutes from './routes/budgets';
import aiRoutes from './routes/ai';


const app = express();
const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable');
  process.exit(1);
}


// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());


// MongoDB Connection
mongoose.connect('mongodb+srv://raunakmed123:raunak@cluster0.v4bjng2.mongodb.net/')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));





// ✅ IN-MEMORY STORAGE (temporary - will reset on server restart)
let goalsStorage: any[] = [
  { _id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000, deadline: '2026-12-31' }
];




// Auth Middleware
interface AuthRequest extends Request {
  userId?: string;
}


const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });


  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


// 🧑 REGISTER
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, country } = req.body as { email: string; password: string; name?: string; country: string };
    const user = new User({ email, password, name, country });
    await user.save();


    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, email, name, country: user.country }
    });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});


// 🔐 LOGIN
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });


    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }


    const token = jwt.sign({ userId: user._id! }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, country: user.country }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 👤 USER INFO
app.get('/api/user', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// 💰 BUDGET ROUTES (GET + PUT)
app.get('/api/budget', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('💰 GET BUDGET');
  res.json({ 
    budget: {
      categories: [
        { name: 'Food', allocated: 300, spent: 250 },
        { name: 'Transport', allocated: 200, spent: 180 },
        { name: 'Entertainment', allocated: 150, spent: 120 }
      ], 
      totalAllocated: 650, 
      totalSpent: 550 
    }
  });
});


app.put('/api/budget', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('💾 SAVE BUDGET:', req.body);
  res.json({ 
    message: 'Budget saved successfully!', 
    budget: req.body 
  });
});


// 🤖 AI TIPS
app.get('/api/ai/tips', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('🤖 AI TIPS REQUESTED');
  res.json({
    tips: [
      "💡 Track daily expenses to identify spending patterns",
      "📈 Set realistic budget goals based on income",
      "🛒 Use cash for discretionary spending to avoid overspending",
      "💳 Pay credit card balance in full each month",
      "🎯 Review and adjust budget monthly"
    ]
  });
});


// 🧹 Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 📈 INVESTMENT ROUTES
app.use('/api/investments', investmentRoutes);

// 💸 TRANSACTIONS ROUTES
app.use('/api/transactions', transactionRoutes);

// 💰 BUDGETS ROUTES
app.use('/api/budgets', authMiddleware, budgetRoutes);

// 🤖 AI ROUTES
app.use('/api/ai', authMiddleware, aiRoutes);

// 🎯 GOALS ROUTES
app.get('/api/goals', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('🎯 GET GOALS');
  res.json({ goals: goalsStorage });
});


app.post('/api/goals', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('🎯 CREATE GOAL:', req.body);
  const newGoal = {
    _id: Date.now().toString(),
    currentAmount: 0,
    ...req.body
  };
  goalsStorage.push(newGoal);
  res.json({
    message: 'Goal created successfully!',
    goal: newGoal
  });
});


app.put('/api/goals/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('🎯 UPDATE GOAL:', req.params.id, req.body);
  const index = goalsStorage.findIndex(g => g._id === req.params.id);
  if (index !== -1) {
    goalsStorage[index] = { ...goalsStorage[index], ...req.body };
  }
  res.json({
    message: 'Goal updated successfully!',
    goal: goalsStorage[index]
  });
});


app.delete('/api/goals/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  console.log('🎯 DELETE GOAL:', req.params.id);
  goalsStorage = goalsStorage.filter(g => g._id !== req.params.id);
  res.json({ message: 'Goal deleted successfully!' });
});


app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Ready for frontend: http://localhost:5173`);
});

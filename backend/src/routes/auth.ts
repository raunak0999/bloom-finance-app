import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: any, res: Response) => {
  try {
    const { email, password, fullName } = req.body;  // ✅ FIXED: name → fullName
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, fullName });  // ✅ FIXED: name → fullName
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    res.status(201).json({ token, user: { id: user._id, email, fullName } });  // ✅ FIXED: name → fullName
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;

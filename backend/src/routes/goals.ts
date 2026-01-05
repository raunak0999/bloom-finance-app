import { Router, Response } from 'express';
import { Goal } from '../models/Goal';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const goal = new Goal({
      ...req.body,
      userId: req.userId
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal' });
  }
});

export default router;

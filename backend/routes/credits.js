import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.get('/my', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ totalCredits: user.credits || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/give', async (req, res) => {
  const { toUserId, amount } = req.body;
  try {
    const user = await User.findById(toUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.credits = (user.credits || 0) + amount;
    await user.save();

    res.json({ message: 'Credits added', credits: user.credits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

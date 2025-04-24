import express from 'express';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
const router = express.Router();

// Get or create chat between two users
router.post('/get-or-create', protect, async (req, res) => {
  const { otherUserEmail } = req.body;
  const userEmail = req.user.email;

  let chat = await Chat.findOne({
    participants: { $all: [userEmail, otherUserEmail] },
  });

  if (!chat) {
    chat = new Chat({ participants: [userEmail, otherUserEmail], messages: [] });
    await chat.save();
  }

  res.json(chat);
});

// Send a message
router.post('/send', protect, async (req, res) => {
  const { otherUserEmail, message } = req.body;
  const userEmail = req.user.email;

  const chat = await Chat.findOne({
    participants: { $all: [userEmail, otherUserEmail] },
  });

  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  chat.messages.push({ sender: userEmail, content: message });
  await chat.save();

  res.json(chat);
});

// ✅ FIXED: Get all chats for the logged-in user
router.get('/my-chats', protect, async (req, res) => {
  try {
    const userEmail = req.user.email;
  
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const chats = await Chat.find({
      participants: user._id,
    })
      .populate('participants', 'name email profilePic')
      .sort({ updatedAt: -1 });
  
    res.status(200).json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all messages of a specific chat
router.get("/chat/:chatId", protect, async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const chat = await Chat.findById(chatId)
      .populate("participants", "name profilePicture")
      .populate({
        path: "messages",
        populate: { path: "sender", select: "name profilePicture" },
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);  // Updated to return only messages
  } catch (err) {
    console.error("❌ Error in /chat/:chatId:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

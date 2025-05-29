// import express from 'express';
// import Chat from '../models/Chat.js';
// import User from '../models/User.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/get-or-create', protect, async (req, res) => {
//   const { otherUserId } = req.body;
//   const currentUserId = req.user._id;

//   let chat = await Chat.findOne({
//     participants: { $all: [currentUserId, otherUserId] },
//   });

//   if (!chat) {
//     chat = new Chat({
//       participants: [currentUserId, otherUserId],
//       messages: [],
//     });
//     await chat.save();
//   }

//   chat = await chat.populate('participants', 'name email profilePic');
//   res.json(chat);
// });

// // Send a message
// router.post('/send', protect, async (req, res) => {
//   try {
//     const { otherUserId, message } = req.body;

//     if (!otherUserId || !message) {
//       return res.status(400).json({ message: 'otherUserId and message are required' });
//     }

//     const sender = await User.findById(req.user._id); // sender's user object
//     const receiver = await User.findById(otherUserId); // recipient's user object

//     if (!sender || !receiver) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const chat = await Chat.findOne({
//       participants: { $all: [sender._id, receiver._id] },
//     });

//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found between users' });
//     }

//     const newMessage = {
//       sender: sender.email,
//       content: message,
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     res.status(200).json({ success: true, chat });
//   } catch (err) {
//     console.error('Chat send error:', err);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// });


// router.get('/my-chats', protect, async (req, res) => {
//   const currentUserId = req.user._id;

//   const chats = await Chat.find({
//     participants: currentUserId,
//   })
//     .populate('participants', 'name email profilePic')
//     .sort({ updatedAt: -1 });

//   res.json(chats);
// });

// router.get('/chat/:chatId', protect, async (req, res) => {
//   const { chatId } = req.params;

//   const chat = await Chat.findById(chatId).populate('participants', 'name email profilePic');
//   if (!chat) return res.status(404).json({ message: 'Chat not found' });

//   res.json(chat.messages);
// });

// export default router;
import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get or create a chat
router.post('/get-or-create', protect, async (req, res) => {
  const { otherUserId } = req.body;
  const currentUserId = req.user._id;

  let chat = await Chat.findOne({
    participants: { $all: [currentUserId, otherUserId] },
  });

  if (!chat) {
    chat = new Chat({
      participants: [currentUserId, otherUserId],
      messages: [],
    });
    await chat.save();
  }

  chat = await chat.populate('participants', 'name email profilePic');
  res.json(chat);
});

// Send a message
router.post('/send', protect, async (req, res) => {
  try {
    const { otherUserId, message } = req.body;
    const currentUserId = req.user._id;

    if (!otherUserId || !message) {
      return res.status(400).json({ message: 'otherUserId and message are required' });
    }

    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUserId] },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found between users' });
    }

    const newMessage = {
      sender: currentUserId,
      content: message,
    };

    chat.messages.push(newMessage);
    await chat.save();

    await chat.populate('messages.sender', 'name email profilePic');

    res.status(200).json({ success: true, newMessage });
  } catch (err) {
    console.error('Chat send error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Get all chats for current user
router.get('/my-chats', protect, async (req, res) => {
  const currentUserId = req.user._id;

  const chats = await Chat.find({
    participants: currentUserId,
  })
    .populate('participants', 'name email profilePic')
    .sort({ updatedAt: -1 });

  res.json(chats);
});

// Get messages of a chat
router.get('/chat/:chatId', protect, async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId)
    .populate('messages.sender', 'name email profilePic')
    .populate('participants', 'name email profilePic');

  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  res.json(chat.messages);
});

export default router;

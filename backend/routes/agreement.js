// const express = require('express');
// const router = express.Router();
// const Chat = require('../models/Chat');  // or wherever your chat model is
// const Agreement = require('../models/Agreement'); // new model we'll create

// // Schema example:
// // Agreement: { chatId, user1Id, user2Id, user1Agreed, user2Agreed }

// router.get('/:chatId', async (req, res) => {
//   try {
//     const agreement = await Agreement.findOne({ chatId: req.params.chatId });
//     if (!agreement) return res.status(404).json({ message: 'No agreement found' });
//     res.json(agreement);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/', async (req, res) => {
//   const { chatId, userId } = req.body;
//   try {
//     let agreement = await Agreement.findOne({ chatId });
//     if (!agreement) {
//       // Create agreement with first user's agreement true
//       const chat = await Chat.findById(chatId);
//       if (!chat) return res.status(404).json({ message: 'Chat not found' });

//       const user1Id = chat.user1.toString();
//       const user2Id = chat.user2.toString();

//       agreement = new Agreement({
//         chatId,
//         user1Id,
//         user2Id,
//         user1Agreed: userId === user1Id,
//         user2Agreed: userId === user2Id,
//       });
//     } else {
//       // Update agreement for existing record
//       if (userId === agreement.user1Id.toString()) agreement.user1Agreed = true;
//       if (userId === agreement.user2Id.toString()) agreement.user2Agreed = true;
//     }
//     await agreement.save();
//     res.json(agreement);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
import express from 'express';
import Chat from '../models/Chat.js';
import Agreement from '../models/Agreement.js';  // ✅ Fix: use ESM default import

const router = express.Router();

router.get('/check/:chatId', async (req, res) => {
  try {
    const agreement = await Agreement.findOne({ chatId: req.params.chatId });
    if (!agreement) return res.status(404).json({ message: 'No agreement found' });
    res.json(agreement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    let agreement = await Agreement.findOne({ chatId });

    if (!agreement) {
      const chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ message: 'Chat not found' });

      const user1Id = chat.participants[0].toString();
      const user2Id = chat.participants[1].toString();

      agreement = new Agreement({
        chatId,
        user1Id,
        user2Id,
        user1Agreed: userId === user1Id,
        user2Agreed: userId === user2Id,
      });
    } else {
      if (userId === agreement.user1Id.toString()) agreement.user1Agreed = true;
      if (userId === agreement.user2Id.toString()) agreement.user2Agreed = true;
    }

    await agreement.save();
    res.json(agreement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // ✅ Fix: ESM export


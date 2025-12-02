import express from 'express';
import { getConversationById, listMessages } from '../lib/state.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const convo = await getConversationById(req.params.id);
    const messages = await listMessages(req.params.id);
    res.json({ conversation: convo, messages });
  } catch (err) {
    res.status(404).json({ error: 'Conversation not found' });
  }
});

export default router;

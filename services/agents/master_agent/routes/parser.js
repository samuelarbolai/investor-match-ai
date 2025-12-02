import express from 'express';

const router = express.Router();

// Proxy to existing conversation_parser service (Python) using same schema as before.
const PARSER_URL = process.env.PARSER_URL || 'http://localhost:8000/v1/conversations';

router.post('/parser', async (req, res) => {
  try {
    const { conversation } = req.body || {};
    if (!conversation || typeof conversation !== 'string' || !conversation.trim()) {
      return res.status(400).json({ error: 'conversation text required' });
    }
    const resp = await fetch(PARSER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: `parser error: ${text}` });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error('parser proxy error', err);
    return res.status(500).json({ error: err?.message || 'Parser proxy failed' });
  }
});

export default router;

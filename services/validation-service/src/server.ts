import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.post('/validate/contact', (req, res) => {
  // TODO: Implement contact validation logic
  res.status(501).json({ error: 'Not implemented' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'validation-service', status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Validation Service running on port ${PORT}`);
});

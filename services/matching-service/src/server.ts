import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MatchHandler } from './handlers/match.handler';

const app = express();
const matchHandler = new MatchHandler();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.post('/matches/find', matchHandler.findMatches.bind(matchHandler));
app.get('/matches/:contactId', matchHandler.getMatches.bind(matchHandler));

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'matching-service', status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Matching Service running on port ${PORT}`);
});

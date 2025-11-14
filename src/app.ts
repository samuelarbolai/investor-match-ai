import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import contactRoutes from './routes/contact.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/contacts', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ContactHandler } from './handlers/contact.handler';
import { db } from './config/firebase';
import { validate } from './middleware/validation.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger, performanceLogger } from './middleware/logging.middleware';
import { 
  createContactSchema, 
  updateContactSchema, 
  matchQuerySchema, 
  contactIdSchema 
} from './validators/contact.validator';
import { IntroductionHandler } from './handlers/introduction.handler';
import { 
  setStageSchema, 
  getContactsInStageSchema,
  bulkSetStageSchema,
  getStageSummarySchema,
  recomputeStageCountsSchema,
} from './validators/introduction.validator';
import { specs, swaggerUi } from './config/swagger';

const app = express();
const contactHandler = new ContactHandler();
const introductionHandler = new IntroductionHandler();

// Security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));


// Logging middleware
app.use(requestLogger);
app.use(performanceLogger);

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Investor Match API Documentation'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: investor-match-api
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
// Health check (no versioning)
app.get('/health', (req, res) => {
  res.json({ 
    service: 'investor-match-api', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.1' // Force rebuild
  });
});

/**
 * @swagger
 * /test-firestore:
 *   get:
 *     summary: Test Firestore database connection
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Firestore connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projectId:
 *                   type: string
 *                   example: investor-match-ai
 *                 data:
 *                   type: object
 *                   description: Test document data
 *       500:
 *         description: Firestore connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Connection failed
 *                 projectId:
 *                   type: string
 *                   example: investor-match-ai
 */
// Test Firestore connection (no versioning)
app.get('/test-firestore', async (req, res) => {
  try {
    console.log('Testing Firestore connection...');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
    
    const testRef = db.collection('test').doc('connection');
    await testRef.set({ test: true, timestamp: new Date() });
    
    const doc = await testRef.get();
    res.json({ 
      success: true, 
      projectId: process.env.FIREBASE_PROJECT_ID,
      data: doc.data() 
    });
  } catch (error: any) {
    console.error('Firestore test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      projectId: process.env.FIREBASE_PROJECT_ID 
    });
  }
});

// V1 API Routes with validation
const v1Router = express.Router();

// Contact CRUD endpoints
v1Router.get('/contacts', 
  contactHandler.getAllContacts.bind(contactHandler)
);

v1Router.post('/contacts', 
  validate(createContactSchema, 'body'),
  contactHandler.createContact.bind(contactHandler)
);

// NEW: Table filtering endpoint
v1Router.post('/contacts/filter',
  contactHandler.filterContacts.bind(contactHandler)
);

// Matching endpoint
v1Router.get('/contacts/:id/matches', 
  validate(contactIdSchema, 'params'),
  validate(matchQuerySchema, 'query'),
  contactHandler.matchContacts.bind(contactHandler)
);

// NEW: Campaign-style matching with selective attributes
v1Router.post('/contacts/:id/campaign-matches',
  validate(contactIdSchema, 'params'),
  contactHandler.campaignMatches.bind(contactHandler)
);

// NEW: Analyze campaign potential across attribute combinations
v1Router.get('/contacts/:id/campaign-analysis',
  validate(contactIdSchema, 'params'),
  contactHandler.analyzeCampaign.bind(contactHandler)
);

v1Router.get('/contacts/:id', 
  validate(contactIdSchema, 'params'),
  contactHandler.getContact.bind(contactHandler)
);

v1Router.patch('/contacts/:id', 
  validate(contactIdSchema, 'params'),
  validate(updateContactSchema, 'body'),
  contactHandler.updateContact.bind(contactHandler)
);

v1Router.delete('/contacts/:id', 
  validate(contactIdSchema, 'params'),
  contactHandler.deleteContact.bind(contactHandler)
);

// Introduction routes
v1Router.post('/introductions/stage',
  validate(setStageSchema, 'body'),
  introductionHandler.setContactStage.bind(introductionHandler)
);

v1Router.get('/introductions/stage',
  validate(getContactsInStageSchema, 'query'),
  introductionHandler.getContactsInStage.bind(introductionHandler)
);

v1Router.post('/introductions/stages/bulk-update',
  validate(bulkSetStageSchema, 'body'),
  introductionHandler.bulkSetContactStage.bind(introductionHandler)
);

v1Router.get('/introductions/stage/summary',
  validate(getStageSummarySchema, 'query'),
  introductionHandler.getStageSummary.bind(introductionHandler)
);

v1Router.post('/introductions/stage/recompute',
  validate(recomputeStageCountsSchema, 'body'),
  introductionHandler.recomputeStageCounts.bind(introductionHandler)
);

// Mount v1 router
app.use('/v1', v1Router);

// Backward compatibility - keep old routes working
app.post('/contacts', 
  validate(createContactSchema, 'body'),
  contactHandler.createContact.bind(contactHandler)
);

app.post('/contacts/filter',
  contactHandler.filterContacts.bind(contactHandler)
);

app.post('/contacts/:id/campaign-matches',
  validate(contactIdSchema, 'params'),
  contactHandler.campaignMatches.bind(contactHandler)
);

app.get('/contacts/:id/campaign-analysis',
  validate(contactIdSchema, 'params'),
  contactHandler.analyzeCampaign.bind(contactHandler)
);

app.get('/contacts/:id', contactHandler.getContact.bind(contactHandler));
app.patch('/contacts/:id', contactHandler.updateContact.bind(contactHandler));
app.delete('/contacts/:id', contactHandler.deleteContact.bind(contactHandler));
app.get('/contacts/:id/matches', contactHandler.matchContacts.bind(contactHandler));

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Contact Service v1.0.0 running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /health');
    console.log('  GET  /test-firestore');
    console.log('  POST /v1/contacts');
    console.log('  GET  /v1/contacts/:id');
    console.log('  PATCH /v1/contacts/:id');
    console.log('  DELETE /v1/contacts/:id');
    console.log('  GET  /v1/contacts/:id/matches');
    console.log('  POST /v1/introductions/stage');
    console.log('  GET  /v1/introductions/stage');
    console.log('  POST /v1/introductions/stages/bulk-update');
  });
}

export { app };
export default app;

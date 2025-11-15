import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Investor Match API',
      version: '1.0.0',
      description: 'Graph-based founder-investor matching system using Firestore as a cost-optimized graph database',
      contact: {
        name: 'API Support',
        url: 'https://github.com/samuelarbolai/investor-match-ai',
      },
    },
    servers: [
      {
        url: 'https://investor-match-api-23715448976.us-east1.run.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['full_name', 'contact_type'],
          properties: {
            id: { type: 'string', description: 'Unique contact identifier' },
            full_name: { type: 'string', description: 'Full name of the contact' },
            headline: { type: 'string', description: 'Professional headline' },
            contact_type: { 
              type: 'string', 
              enum: ['founder', 'investor', 'both'],
              description: 'Type of contact'
            },
            location_city: { type: 'string', nullable: true },
            location_country: { type: 'string', nullable: true },
            skills: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Array of skills'
            },
            industries: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Array of industries'
            },
            funding_stages: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Array of funding stages'
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        MatchResult: {
          type: 'object',
          properties: {
            seedContact: { $ref: '#/components/schemas/Contact' },
            candidates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  contact: { $ref: '#/components/schemas/Contact' },
                  score: { type: 'number', description: 'Match score' },
                  overlaps: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Shared attributes'
                  }
                }
              }
            },
            totalMatches: { type: 'number' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            details: { type: 'object', description: 'Additional error details' }
          }
        }
      }
    }
  },
  apis: ['./src/handlers/*.ts', './src/server.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };

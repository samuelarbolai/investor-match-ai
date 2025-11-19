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
            job_to_be_done: {
              type: 'array',
              items: { type: 'string' },
              description: 'Intent of the contact (Raise Capital, Invest Capital, etc.)'
            },
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
            verticals: {
              type: 'array',
              items: { type: 'string' },
              description: 'Verticals / sub-industries'
            },
            product_types: {
              type: 'array',
              items: { type: 'string' },
              description: 'Type of good produced (software, hardware, etc.)'
            },
            raised_capital_range_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Raised capital range identifiers'
            },
            raised_capital_range_labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Human readable raised capital labels'
            },
            company_headcount_ranges: {
              type: 'array',
              items: { type: 'string' },
              description: 'Company headcount ranges'
            },
            engineering_headcount_ranges: {
              type: 'array',
              items: { type: 'string' },
              description: 'Engineering headcount ranges'
            },
            distribution_capability_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Distribution capability identifiers'
            },
            distribution_capability_labels: {
              type: 'array',
              items: { type: 'string' }
            },
            target_criterion_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'IDs of normalized target criteria'
            },
            target_criterion_summaries: {
              type: 'array',
              items: { type: 'string' }
            },
            target_industries: {
              type: 'array',
              items: { type: 'string' },
              description: 'Industries this contact is targeting'
            },
            target_verticals: {
              type: 'array',
              items: { type: 'string' }
            },
            target_skills: {
              type: 'array',
              items: { type: 'string' }
            },
            target_roles: {
              type: 'array',
              items: { type: 'string' }
            },
            target_product_types: {
              type: 'array',
              items: { type: 'string' }
            },
            target_raised_capital_range_ids: {
              type: 'array',
              items: { type: 'string' }
            },
            target_raised_capital_range_labels: {
              type: 'array',
              items: { type: 'string' }
            },
            target_company_headcount_ranges: {
              type: 'array',
              items: { type: 'string' }
            },
            target_engineering_headcount_ranges: {
              type: 'array',
              items: { type: 'string' }
            },
            target_distribution_capability_ids: {
              type: 'array',
              items: { type: 'string' }
            },
            target_distribution_capability_labels: {
              type: 'array',
              items: { type: 'string' }
            },
            target_location_cities: {
              type: 'array',
              items: { type: 'string' }
            },
            target_location_countries: {
              type: 'array',
              items: { type: 'string' }
            },
            target_foundation_years: {
              type: 'array',
              items: { type: 'string' }
            },
            target_mrr_ranges: {
              type: 'array',
              items: { type: 'string' }
            },
            target_company_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Company IDs (from experiences) the contact is targeting'
            },
            experiences: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  company_name: { type: 'string' },
                  company_id: { type: 'string' },
                  role: { type: 'string' },
                  seniority: { type: 'string' },
                  start_date: { type: 'string' },
                  end_date: { type: 'string', nullable: true },
                  current: { type: 'boolean' },
                  description: { type: 'string', nullable: true },
                  location_city: { type: 'string', nullable: true },
                  location_country: { type: 'string', nullable: true }
                }
              }
            },
            action_status: {
              type: 'string',
              enum: ['action_required', 'waiting'],
              description: 'Indicates whether the funnel needs manual action'
            },
            stage_counts: {
              type: 'object',
              additionalProperties: { type: 'number' },
              description: 'Cached introduction counts per stage'
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
        },
        Introduction: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Unique introduction identifier (ownerId__targetId)' },
            ownerId: { type: 'string', description: 'Contact ID that owns the pipeline' },
            targetId: { type: 'string', description: 'Contact ID added to the pipeline' },
            stage: {
              type: 'string',
              description: 'Pipeline stage for the target contact',
              enum: ['prospect', 'lead', 'to-meet', 'met', 'not-in-campaign', 'disqualified']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        IntroductionStageUpdate: {
          type: 'object',
          required: ['ownerId', 'targetId', 'stage'],
          properties: {
            ownerId: { type: 'string' },
            targetId: { type: 'string' },
            stage: {
              type: 'string',
              enum: ['prospect', 'lead', 'to-meet', 'met', 'not-in-campaign', 'disqualified']
            }
          }
        },
        IntroductionBulkStageUpdate: {
          type: 'object',
          required: ['ownerId', 'updates'],
          properties: {
            ownerId: { type: 'string' },
            updates: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['targetId', 'stage'],
                properties: {
                  targetId: { type: 'string' },
                  stage: {
                    type: 'string',
                    enum: ['prospect', 'lead', 'to-meet', 'met', 'not-in-campaign', 'disqualified']
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/handlers/*.ts', './src/server.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };

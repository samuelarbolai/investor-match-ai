import { Request, Response } from 'express';
import { collections, Timestamp } from '../config/firebase';
import { Contact, ContactInput, ContactType } from '../models/contact.model';
import { writeSyncService } from '../services/write-sync.service';
import { matchingService } from '../services/matching.service';

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management and matching
 */

export class ContactHandler {
  /**
   * @swagger
   * /v1/contacts:
   *   post:
   *     summary: Create a new contact
   *     tags: [Contacts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - full_name
   *               - contact_type
   *             properties:
   *               full_name:
   *                 type: string
   *                 description: Full name of the contact
   *                 example: "Jane Founder"
   *               contact_type:
   *                 type: string
   *                 enum: [founder, investor, both]
   *                 description: Type of contact
   *                 example: "founder"
   *               headline:
   *                 type: string
   *                 description: Professional headline
   *                 example: "Building the future of fintech"
   *               location_city:
   *                 type: string
   *                 description: City location
   *                 example: "San Francisco"
   *               location_country:
   *                 type: string
   *                 description: Country location
   *                 example: "USA"
   *               skills:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of skills
   *                 example: ["javascript", "product-management", "fundraising"]
   *               industries:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of industries
   *                 example: ["fintech", "saas", "b2b"]
   *               verticals:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of verticals
   *                 example: ["payments", "lending"]
   *               funding_stages:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of funding stages
   *                 example: ["seed", "series-a"]
   *               current_company:
   *                 type: string
   *                 description: Current company name
   *                 example: "TechStartup Inc"
   *               current_role:
   *                 type: string
   *                 description: Current role/position
   *                 example: "CEO & Founder"
   *               linkedin_url:
   *                 type: string
   *                 description: LinkedIn profile URL
   *                 example: "https://linkedin.com/in/jane-founder"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email address
   *                 example: "jane@techstartup.com"
   *           examples:
   *             founder:
   *               summary: Founder example
   *               value:
   *                 full_name: "Jane Founder"
   *                 contact_type: "founder"
   *                 headline: "Building the future of fintech"
   *                 location_city: "San Francisco"
   *                 location_country: "USA"
   *                 skills: ["javascript", "product-management", "fundraising"]
   *                 industries: ["fintech", "saas"]
   *                 funding_stages: ["seed", "series-a"]
   *                 current_company: "TechStartup Inc"
   *                 current_role: "CEO & Founder"
   *                 linkedin_url: "https://linkedin.com/in/jane-founder"
   *                 email: "jane@techstartup.com"
   *             investor:
   *               summary: Investor example
   *               value:
   *                 full_name: "Bob Investor"
   *                 contact_type: "investor"
   *                 headline: "Partner at VentureCapital Fund"
   *                 location_city: "New York"
   *                 location_country: "USA"
   *                 skills: ["due-diligence", "portfolio-management"]
   *                 industries: ["fintech", "healthcare", "ai"]
   *                 funding_stages: ["series-a", "series-b"]
   *                 current_company: "VentureCapital Fund"
   *                 current_role: "Partner"
   *                 linkedin_url: "https://linkedin.com/in/bob-investor"
   *                 email: "bob@vcfund.com"
   *     responses:
   *       201:
   *         description: Contact created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Contact'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async createContact(req: Request, res: Response): Promise<void> {
    try {
      const input: ContactInput = req.body;
      const contactRef = collections.contacts().doc();
      
      // Use WriteSyncService for proper data layer integration
      await writeSyncService.createOrUpdateContact(contactRef.id, input, false);
      
      // Get the created contact
      const doc = await contactRef.get();
      const contact = doc.data() as Contact;
      
      res.status(201).json(contact);
    } catch (error) {
      console.error('Failed to create contact:', error);
      res.status(500).json({ error: 'Failed to create contact' });
    }
  }

  /**
   * @swagger
   * /v1/contacts/{id}:
   *   get:
   *     summary: Get contact by ID
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Contact ID
   *         example: "jane-founder-abc123"
   *     responses:
   *       200:
   *         description: Contact found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Contact'
   *       404:
   *         description: Contact not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doc = await collections.contacts().doc(id).get();
      
      if (!doc.exists) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      
      const contact = { id: doc.id, ...doc.data() } as Contact;
      res.json(contact);
    } catch (error) {
      console.error('Failed to get contact:', error);
      res.status(500).json({ error: 'Failed to get contact' });
    }
  }

    /**
   * @swagger
   * /v1/contacts:
   *   get:
   *     summary: Get all contacts with pagination
   *     tags: [Contacts]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *           maximum: 100
   *         description: Number of contacts per page (max 100)
   *       - in: query
   *         name: startAfter
   *         schema:
   *           type: string
   *         description: Contact ID to start after (for pagination)
   *     responses:
   *       200:
   *         description: List of contacts with pagination info
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *                       email:
   *                         type: string
   *                       type:
   *                         type: string
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                       description: Number of contacts in current page
   *                     limit:
   *                       type: integer
   *                       description: Page size limit
   *                     nextCursor:
   *                       type: string
   *                       nullable: true
   *                       description: ID of last contact (use as startAfter for next page)
   *                     hasMore:
   *                       type: boolean
   *                       description: Whether more pages are available
   *       500:
   *         description: Server error
   */
  async getAllContacts(req: Request, res: Response): Promise<void> {
  try {
    const { 
      limit = '10', 
      startAfter
    } = req.query;

    const pageSize = Math.min(parseInt(limit as string), 100);
    
    let query = collections.contacts().limit(pageSize);

    // If startAfter is provided, get that document and start after it
    if (startAfter) {
      const startDoc = await collections.contacts().doc(startAfter as string).get();
      if (startDoc.exists) {
        query = query.startAfter(startDoc);
      }
    }

    const snapshot = await query.get();
    
    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Contact[];

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    res.json({
      data: contacts,
      pagination: {
        total: contacts.length,
        limit: pageSize,
        nextCursor: lastDoc ? lastDoc.id : null,
        hasMore: contacts.length === pageSize
      }
    });
  } catch (error) {
    console.error('Failed to get contacts:', error);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
}

  /**
  ## Usage:

  **First page:**
  GET /v1/contacts?limit=20

  **Next page:**
  GET /v1/contacts?limit=20&startAfter=<lastContactId>

  **Custom sorting:**
  GET /v1/contacts?limit=20&orderBy=name&direction=asc  s
  */
  

    /**
   * @swagger
   * /v1/contacts/{id}:
   *   patch:
   *     summary: Update an existing contact
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Contact ID
   *         example: "jane-founder-abc123"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               full_name:
   *                 type: string
   *                 description: Full name of the contact
   *                 example: "Jane Founder"
   *               contact_type:
   *                 type: string
   *                 enum: [founder, investor, both]
   *                 description: Type of contact
   *                 example: "founder"
   *               headline:
   *                 type: string
   *                 description: Professional headline
   *                 example: "Building the future of fintech"
   *               location_city:
   *                 type: string
   *                 description: City location
   *                 example: "San Francisco"
   *               location_country:
   *                 type: string
   *                 description: Country location
   *                 example: "USA"
   *               skills:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of skills
   *                 example: ["javascript", "product-management", "fundraising"]
   *               industries:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of industries
   *                 example: ["fintech", "saas", "b2b"]
   *               verticals:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of verticals
   *                 example: ["payments", "lending"]
   *               funding_stages:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of funding stages
   *                 example: ["seed", "series-a"]
   *               current_company:
   *                 type: string
   *                 description: Current company name
   *                 example: "TechStartup Inc"
   *               current_role:
   *                 type: string
   *                 description: Current role/position
   *                 example: "CEO & Founder"
   *               linkedin_url:
   *                 type: string
   *                 description: LinkedIn profile URL
   *                 example: "https://linkedin.com/in/jane-founder"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email address
   *                 example: "jane@techstartup.com"
   *           examples:
   *             updateHeadline:
   *               summary: Update headline only
   *               value:
   *                 headline: "Now scaling fintech to 10M users"
   *             updateLocation:
   *               summary: Update location
   *               value:
   *                 location_city: "Austin"
   *                 location_country: "USA"
   *             updateSkills:
   *               summary: Update skills
   *               value:
   *                 skills: ["javascript", "react", "node.js", "aws"]
   *     responses:
   *       200:
   *         description: Contact updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Contact'
   *       404:
   *         description: Contact not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: Partial<ContactInput> = req.body;
      
      // Check if contact exists
      const doc = await collections.contacts().doc(id).get();
      if (!doc.exists) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      
      // Use WriteSyncService for proper reverse index sync
      await writeSyncService.createOrUpdateContact(id, updates as ContactInput, true);
      
      // Get updated contact
      const updatedDoc = await collections.contacts().doc(id).get();
      const contact = updatedDoc.data() as Contact;
      
      res.json(contact);
    } catch (error) {
      console.error('Failed to update contact:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  }

  /**
   * @swagger
   * /v1/contacts/{id}:
   *   delete:
   *     summary: Delete contact by ID
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Contact ID
   *         example: "jane-founder-abc123"
   *     responses:
   *       200:
   *         description: Contact deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Contact deleted successfully"
   *                 id:
   *                   type: string
   *                   example: "contact-123"
   *       404:
   *         description: Contact not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Use WriteSyncService for proper cleanup
      await writeSyncService.deleteContact(id);
      
      res.status(204).send(); // No content
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete contact' });
      }
    }
  }

  
  /**
   * @swagger
   * /v1/contacts/filter:
   *   post:
   *     summary: Filter contacts by multiple attributes
   *     tags: [Contacts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               contact_type:
   *                 type: string
   *                 enum: [founder, investor, both]
   *                 description: Filter by contact type
   *               skills:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Filter by skills (OR logic)
   *               industries:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Filter by industries (OR logic)
   *               verticals:
   *                 type: array
   *                 items:
   *                   type: string
   *               funding_stages:
   *                 type: array
   *                 items:
   *                   type: string
   *               location_city:
   *                 type: string
   *                 description: Filter by city
   *               location_country:
   *                 type: string
   *                 description: Filter by country
   *               match_mode:
   *                 type: string
   *                 enum: [any, all]
   *                 default: any
   *                 description: Match any filter (OR) or all filters (AND)
   *               limit:
   *                 type: integer
   *                 default: 20
   *                 maximum: 100
   *               stage_count_filters:
   *                 type: object
   *                 additionalProperties:
   *                   type: object
   *                   properties:
   *                     min:
   *                       type: integer
   *                     max:
   *                       type: integer
   *                 description: Numeric filters for introduction stage counts per contact (keys: prospect, lead, to-meet, met, not-in-campaign, disqualified)
   *           examples:
   *             fintech_investors:
   *               summary: Find fintech investors in SF
   *               value:
   *                 contact_type: "investor"
   *                 industries: ["fintech"]
   *                 location_city: "San Francisco"
   *                 match_mode: "all"
   *                 limit: 20
   *     responses:
   *       200:
   *         description: Filtered contacts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Contact'
   *                 total:
   *                   type: integer
   *                 filters_applied:
   *                   type: object
   */
  async filterContacts(req: Request, res: Response): Promise<void> {
    try {
      const {
        contact_type,
        skills,
        industries,
        verticals,
        funding_stages,
        location_city,
        location_country,
        match_mode = 'any',
        limit = 20,
        stage_count_filters,
      } = req.body;

      const result = await matchingService.filterContacts({
        contact_type,
        skills,
        industries,
        verticals,
        funding_stages,
        location_city,
        location_country,
        match_mode,
        limit: Math.min(parseInt(limit as string, 10), 100),
        stage_count_filters,
      });

      res.json(result);
    } catch (error) {
      console.error('Failed to filter contacts:', error);
      res.status(500).json({ error: 'Failed to filter contacts' });
    }
  }

  /**
   * @swagger
   * /v1/contacts/{id}/campaign-matches:
   *   post:
   *     summary: Find matches using selective contact attributes (campaign mode)
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Contact ID to use as seed
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               attributes:
   *                 type: array
   *                 items:
   *                   type: string
   *                   enum: [skills, industries, verticals, funding_stages, location]
   *                 description: Which attributes to use for matching
   *                 example: ["industries", "location"]
   *               target_type:
   *                 type: string
   *                 enum: [founder, investor, both]
   *                 default: investor
   *               limit:
   *                 type: integer
   *                 default: 20
   *                 maximum: 100
   *           examples:
   *             location_only:
   *               summary: Match by location only
   *               value:
   *                 attributes: ["location"]
   *                 target_type: "investor"
   *                 limit: 20
   *             industry_and_stage:
   *               summary: Match by industry and funding stage
   *               value:
   *                 attributes: ["industries", "funding_stages"]
   *                 target_type: "investor"
   *                 limit: 20
   *             all_attributes:
   *               summary: Match with all properties
   *               value:
   *                 attributes: ["skills", "industries", "verticals", "funding_stages", "location"]
   *                 target_type: "investor"
   *                 limit: 20
   *     responses:
   *       200:
   *         description: Campaign matches found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 candidates:
   *                   type: array
   *                   items:
   *                     type: object
   *                 totalMatches:
   *                   type: integer
   *                 seedContact:
   *                   $ref: '#/components/schemas/Contact'
   *                 attributes_used:
   *                   type: array
   *                   items:
   *                     type: string
   */
  async campaignMatches(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Debug logging
      console.log('=== CAMPAIGN MATCH DEBUG ===');
      console.log('Request URL:', req.url);
      console.log('Request method:', req.method);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Raw body:', req.body);
      console.log('Body type:', typeof req.body);
      console.log('Body keys:', Object.keys(req.body || {}));
      console.log('===========================');
      
      const {
        attributes = [],
        target_type = 'investor',
        limit = 20
      } = req.body || {};

      console.log('Campaign match request body:', req.body);
      console.log('Extracted attributes:', attributes);
      console.log('Target type:', target_type);

      // Validate attributes array
      if (!Array.isArray(attributes)) {
        res.status(400).json({ 
          error: 'attributes must be an array',
          received: typeof attributes,
          body_received: req.body
        });
        return;
      }

      if (attributes.length === 0) {
        res.status(400).json({ 
          error: 'attributes array cannot be empty',
          valid_attributes: ['skills', 'industries', 'verticals', 'funding_stages', 'location'],
          body_received: req.body
        });
        return;
      }

      // Validate attributes
      const validAttributes = ['skills', 'industries', 'verticals', 'funding_stages', 'location'];
      const invalidAttrs = attributes.filter((a: string) => !validAttributes.includes(a));
      
      if (invalidAttrs.length > 0) {
        res.status(400).json({ 
          error: `Invalid attributes: ${invalidAttrs.join(', ')}`,
          valid_attributes: validAttributes
        });
        return;
      }

      const result = await matchingService.campaignMatch(
        id,
        attributes,
        target_type as ContactType,
        Math.min(parseInt(limit as string), 100)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Failed to perform campaign match:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.status(500).json({ error: 'Failed to perform campaign match' });
      }
    }
  }

  /**
   * @swagger
   * /v1/contacts/{id}/campaign-analysis:
   *   get:
   *     summary: Analyze match potential across different attribute combinations
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: target_type
   *         schema:
   *           type: string
   *           enum: [founder, investor, both]
   *           default: investor
   *     responses:
   *       200:
   *         description: Analysis of match potential by attribute combination
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 contact:
   *                   $ref: '#/components/schemas/Contact'
   *                 combinations:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       attributes:
   *                         type: array
   *                         items:
   *                           type: string
   *                       match_count:
   *                         type: integer
   *                       description:
   *                         type: string
   */
  async analyzeCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { target_type = 'investor' } = req.query;

      const analysis = await matchingService.analyzeCampaignPotential(
        id,
        target_type as ContactType
      );

      res.json(analysis);
    } catch (error: any) {
      console.error('Failed to analyze campaign:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.status(500).json({ error: 'Failed to analyze campaign' });
      }
    }
  }

  /**
   * @swagger
   * /v1/contacts/{id}/matches:
   *   get:
   *     summary: Find matches for a contact
   *     tags: [Contacts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Contact ID to find matches for
   *         example: "jane-founder-abc123"
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [founder, investor]
   *         description: Type of contacts to match with
   *         example: "investor"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Maximum number of matches to return
   *         example: 10
   *     responses:
   *       200:
   *         description: Matches found successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MatchResult'
   *       404:
   *         description: Contact not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */

  async matchContacts(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { targetType = 'investor', limit = 20 } = req.query;
      
      // Validate targetType
      if (!['founder', 'investor', 'both'].includes(targetType as string)) {
        res.status(400).json({ error: 'targetType must be founder, investor, or both' });
        return;
      }
      
      // Validate limit
      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        res.status(400).json({ error: 'limit must be between 1 and 100' });
        return;
      }
      
      console.log(`Matching contact ${id} with ${targetType} contacts, limit: ${limitNum}`);
      
      // Perform matching
      const matchResult = await matchingService.matchContact(
        id,
        targetType as ContactType,
        limitNum
      );
      
      res.json(matchResult);

    } catch (error: any) {
      console.error('Failed to match contacts:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.status(500).json({ error: 'Failed to match contacts' });
      }
    }
  } 
}

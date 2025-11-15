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
   * /v1/contacts/{id}:
   *   patch:
   *     summary: Update contact by ID
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
   *             $ref: '#/components/schemas/Contact'
   *           example:
   *             headline: "Updated headline"
   *             skills: ["python", "machine-learning"]
   *             industries: ["ai", "healthcare"]
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

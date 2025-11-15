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
   *             $ref: '#/components/schemas/Contact'
   *           example:
   *             full_name: "Jane Founder"
   *             contact_type: "founder"
   *             headline: "Building the future of fintech"
   *             skills: ["javascript", "product-management"]
   *             industries: ["fintech", "saas"]
   *             funding_stages: ["seed", "series-a"]
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
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [founder, investor]
   *         description: Type of contacts to match with
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Maximum number of matches to return
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

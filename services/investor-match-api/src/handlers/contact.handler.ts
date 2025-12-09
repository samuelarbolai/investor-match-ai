import admin from 'firebase-admin';
import { listContactsQuerySchema, mapSortField, ListContactsSortField } from '../validators/contact.validator';
import { Request, Response } from 'express';
import { collections, Timestamp } from '../config/firebase';
import { Contact, ContactInput, ContactType } from '../models/contact.model';
import { writeSyncService } from '../services/write-sync.service';
import { matchingService } from '../services/matching.service';
import { flatteningService, DistributionQualityBucket } from '../services/flattening.service';
import { DistributionCapabilityInput, DistributionCapability } from '../models/distribution-capability.model';
import { TargetCriterionInput } from '../models/target-criterion.model';
import { CompanyInput } from '../models/company.model';
import { deriveActionStatus } from '../utils/action-status';
import { companySyncService } from '../services/company-sync.service';
import { distributionCapabilitySyncService } from '../services/distribution-capability-sync.service';
import { Company } from '../models/company.model';

export const normalizeString = (value?: string | null): string | null => {
  if (!value) return null;
  return value.trim().toLowerCase() || null;
};

const normalizeTags = (input: unknown): string[] => {
  if (!input) return [];
  const raw = Array.isArray(input) ? input : [input];
  return raw
    .flatMap(value => String(value).split(','))
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => Boolean(tag));
};

export type ContactRequestExtras = {
  distribution_capabilities?: DistributionCapabilityInput[];
  target_criteria?: TargetCriterionInput[];
  companies?: CompanyInput[];
};

export async function findExistingContact(body: any): Promise<Contact | null> {
  const email = normalizeString(body?.email);
  const linkedin = normalizeString(body?.linkedin_url);

  if (email) {
    const snapshot = await collections.contacts().where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { ...(doc.data() as Contact), id: doc.id };
    }
  }

  if (linkedin) {
    const snapshot = await collections.contacts().where('linkedin_url', '==', linkedin).limit(1).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { ...(doc.data() as Contact), id: doc.id };
    }
  }

  return null;
}

interface PreparedContactPayload {
  contact: ContactInput;
  normalizedCompanies: Company[];
  distributionCapabilities: DistributionCapability[];
  distributionQualityBuckets: DistributionQualityBucket[];
}

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
   *               raised_capital_range_ids:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Canonical raised capital range identifiers (preferred over legacy funding_stages)
   *                 example: ["less_than_500k_usd"]
   *               stage_counts:
   *                 type: object
   *                 description: Cached introduction stage counts used for action status
   *                 example:
   *                   prospect: 3
   *                   lead: 1
   *                   to-meet: 0
   *                   met: 0
   *                   not-in-campaign: 0
   *                   disqualified: 0
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
   *               experiences:
   *                 type: array
   *                 description: Embedded work history used to create `/experiences` + `/companies` nodes
   *                 items:
   *                   type: object
   *                   properties:
   *                     company_name:
   *                       type: string
   *                     company_id:
   *                       type: string
   *                     role:
   *                       type: string
   *                     seniority:
   *                       type: string
   *                     start_date:
   *                       type: string
   *                       example: "2023-01"
   *                     end_date:
   *                       type: string
   *                       nullable: true
   *                     current:
   *                       type: boolean
   *                     description:
   *                       type: string
   *                     location_city:
   *                       type: string
   *                     location_country:
   *                       type: string
   *               distribution_capabilities:
   *                 type: array
   *                 description: Normalized distribution payloads (persisted to `/distributionCapabilities` with score history)
   *                 items:
   *                   type: object
   *                   properties:
   *                     distribution_type:
   *                       type: string
   *                     label:
   *                       type: string
   *                     size_score:
   *                       type: number
   *                     engagement_score:
   *                       type: number
   *                     quality_score:
   *                       type: number
   *                     source_url:
   *                       type: string
   *               target_criteria:
   *                 type: array
   *                 description: Structured investor thesis dimensions
   *                 items:
   *                   type: object
   *                   properties:
   *                     dimension:
   *                       type: string
   *                     operator:
   *                       type: string
   *                       enum: ['=', 'in', '>=', '<=', 'between']
   *                     value:
   *                       description: Raw value (string, array, or numeric)
   *               companies:
   *                 type: array
   *                 description: Optional normalized companies to ensure `/companies` docs exist
   *                 items:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     domain:
   *                       type: string
   *           examples:
   *             founder:
   *               summary: Founder example
   *               value:
   *                 full_name: "Alicia Founder"
   *                 contact_type: "founder"
   *                 headline: "Building embedded fintech rails"
   *                 email: "alicia@example.com"
   *                 location_city: "New York"
   *                 location_country: "USA"
   *                 current_company: "Atlas Labs"
   *                 current_role: "Co-founder & CEO"
   *                 job_to_be_done: ["raise_seed"]
   *                 skills: ["javascript", "product_management"]
   *                 industries: ["fintech", "saas"]
   *                 verticals: ["payments"]
   *                 raised_capital_range_ids: ["less_than_500k_usd"]
   *                 stage_counts:
   *                   prospect: 3
   *                   lead: 1
   *                   to-meet: 0
   *                   met: 0
   *                   not-in-campaign: 0
   *                   disqualified: 0
   *                 experiences:
   *                   - company_name: "Atlas Labs"
   *                     company_id: "atlas_labs"
   *                     role: "CEO"
   *                     seniority: "executive"
   *                     start_date: "2023-01"
   *                     end_date: null
   *                     current: true
   *                 distribution_capabilities:
   *                   - distribution_type: "SocialMedia"
   *                     label: "Twitter audience 50k"
   *                     size_score: 0.8
   *                     engagement_score: 0.7
   *                     quality_score: 0.6
   *                 target_criteria:
   *                   - dimension: "Industry"
   *                     operator: "in"
   *                     value: ["Fintech", "Payments"]
   *                 companies:
   *                   - name: "Atlas Labs"
   *                     domain: "atlaslabs.com"
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
   *                 current_company: "VentureCapital Fund"
   *                 current_role: "Partner"
   *                 target_criteria:
   *                   - dimension: "Location"
   *                     operator: "in"
   *                     value: ["USA", "Canada"]
   *                   - dimension: "RaisedCapital"
   *                     operator: ">="
   *                     value: ["Series A"]
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
      // Deduplicate by email or linkedin_url before creating.
      const duplicate = await findExistingContact(req.body);
      if (duplicate) {
        res.status(200).json(duplicate);
        return;
      }

      const contactRef = collections.contacts().doc();
      const {
        contact: preparedContact,
        normalizedCompanies,
        distributionCapabilities,
        distributionQualityBuckets
      } = prepareContactPayload(req.body as ContactInput & ContactRequestExtras);
      
      await writeSyncService.createOrUpdateContact(contactRef.id, preparedContact, false);
      await companySyncService.syncCompanies(contactRef.id, normalizedCompanies, preparedContact.experiences || []);
      await distributionCapabilitySyncService.syncCapabilities(
        contactRef.id,
        distributionCapabilities,
        distributionQualityBuckets
      );
      
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
   *       - in: query
   *         name: order_by
   *         schema:
   *           type: string
   *           enum:
   *             - full_name
   *             - contact_type
   *             - created_at
   *             - updated_at
   *         description: Field used to sort results (default created_at)
   *       - in: query
   *         name: tags
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Optional tags to include - only show contacts with these tags (e.g., test, coverage)
   *       - in: query
   *         name: exclude_tags
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Optional tags to exclude (e.g., coverage, test)
   *       - in: query
   *         name: order_direction
   *         schema:
   *           type: string
   *           enum:
   *             - asc
   *             - desc
   *         description: Sort direction (default asc)
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
    const { value: query, error } = listContactsQuerySchema.validate(req.query, { convert: true });
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { limit, startAfter, order_by, order_direction, exclude_tags, tags } = query as {
      limit: number;
      startAfter?: string;
      order_by: ListContactsSortField;
      order_direction: FirebaseFirestore.OrderByDirection;
      exclude_tags?: string[] | string;
      tags?: string[] | string;
    };
    const sortField = mapSortField(order_by as ListContactsSortField);
    const excluded = new Set(normalizeTags(exclude_tags));
    const included = new Set(normalizeTags(tags));

    let baseQuery = collections.contacts()
      .orderBy(sortField, order_direction as FirebaseFirestore.OrderByDirection)
      .orderBy(admin.firestore.FieldPath.documentId());

    if (startAfter) {
      const cursorDoc = await collections.contacts().doc(startAfter).get();
      if (!cursorDoc.exists) {
        res.status(400).json({ error: 'Invalid startAfter cursor' });
        return;
      }
      baseQuery = baseQuery.startAfter(cursorDoc);
    }

    const filtered: Contact[] = [];
    let hasMore = false;
    let nextCursor: string | null = null;
    let cursorDoc: FirebaseFirestore.DocumentSnapshot | undefined;
    const fetchLimit = Math.min(Math.max(limit * 2, limit + 10), 300);

    while (filtered.length < limit) {
      let queryToRun = baseQuery.limit(fetchLimit);
      if (cursorDoc) {
        queryToRun = queryToRun.startAfter(cursorDoc);
      }

      const snapshot = await queryToRun.get();
      if (snapshot.empty) {
        hasMore = false;
        nextCursor = null;
        break;
      }

      cursorDoc = snapshot.docs[snapshot.docs.length - 1];
      const batchContacts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Contact))
        .filter(contact => {
          const tag = typeof contact.tag === 'string' ? contact.tag.trim().toLowerCase() : null;

          // If tags (include) is specified, ONLY include contacts with those tags
          if (included.size > 0) {
            if (!tag || !included.has(tag)) {
              return false;
            }
          }

          // If exclude_tags is specified, exclude contacts with those tags
          if (excluded.size > 0) {
            if (tag && excluded.has(tag)) {
              return false;
            }
          }

          return true;
        });

      for (const contact of batchContacts) {
        if (filtered.length >= limit) {
          break;
        }
        filtered.push(contact);
      }

      if (snapshot.size < fetchLimit) {
        hasMore = false;
        nextCursor = cursorDoc ? cursorDoc.id : null;
        break;
      }

      hasMore = true;
      nextCursor = cursorDoc ? cursorDoc.id : null;
    }

    res.json({
      data: filtered,
      pagination: {
        total: filtered.length,
        limit,
        nextCursor,
        hasMore: hasMore && Boolean(nextCursor),
      },
    });
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
      const updates = req.body as Partial<ContactInput> & ContactRequestExtras;
      
      // Check if contact exists
      const doc = await collections.contacts().doc(id).get();
      if (!doc.exists) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }

      const existing = doc.data() as Contact;
      const {
        contact: preparedContact,
        normalizedCompanies,
        distributionCapabilities,
        distributionQualityBuckets
      } = prepareContactPayload(updates, existing);
      
      // Use WriteSyncService for proper reverse index sync
      await writeSyncService.createOrUpdateContact(id, preparedContact, true);
      await companySyncService.syncCompanies(id, normalizedCompanies, preparedContact.experiences || []);
      await distributionCapabilitySyncService.syncCapabilities(
        id,
        distributionCapabilities,
        distributionQualityBuckets
      );
      
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
   *               company_names:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Company names to match (current or previous employers)
   *               company_scope:
   *                 type: string
   *                 enum: [current, experience, any]
   *                 description: Limit company filtering to current company, experiences, or both (default any)
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
   *                 description: "Numeric filters for introduction stage counts per contact (keys: prospect, lead, to-meet, met, not-in-campaign, disqualified)"
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Tags to include - only show contacts with these tags (e.g., test, coverage)
   *               exclude_tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Tags to exclude (e.g., coverage, test)
   *           examples:
   *             fintech_investors:
   *               summary: Find fintech investors in SF
   *               value:
   *                 contact_type: "investor"
   *                 industries: ["fintech"]
   *                 location_city: "San Francisco"
   *                 company_names: ["OpenAI"]
   *                 company_scope: "experience"
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
        company_names,
        company_scope,
        exclude_tags,
        tags
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
        company_names,
        company_scope,
        exclude_tags: normalizeTags(exclude_tags),
        tags: normalizeTags(tags)
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
   *               exclude_tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Tags to exclude from candidate matches (e.g., coverage, test)
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
        limit = 20,
        exclude_tags
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
        Math.min(parseInt(limit as string), 100),
        normalizeTags(exclude_tags)
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
   *         name: targetType
   *         schema:
   *           type: string
   *           enum: [founder, investor, both]
   *           default: investor
   *         description: Match this contact against founders, investors, or both
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
   *       - in: query
   *         name: exclude_tags
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Tags to exclude from candidate matches (e.g., coverage, test)
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
      const { targetType = 'investor', limit = 20, exclude_tags } = req.query;
      
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
        limitNum,
        normalizeTags(exclude_tags)
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

export function prepareContactPayload(
  payload: Partial<ContactInput> & ContactRequestExtras,
  existing?: Contact
): PreparedContactPayload {
  const {
    distribution_capabilities = [],
    target_criteria = [],
    companies = [],
    ...rest
  } = payload;

  const base: ContactInput = {
    ...(existing ? stripContactSystemFields(existing) : {}),
    ...(rest as ContactInput)
  };
  base.email = normalizeString(base.email);
  base.linkedin_url = normalizeString(base.linkedin_url);

  base.experiences = base.experiences || [];
  base.raised_capital_range_ids = base.raised_capital_range_ids || [];
  base.raised_capital_range_labels = base.raised_capital_range_labels || [];
  base.distribution_capability_ids = base.distribution_capability_ids || [];
  base.distribution_capability_labels = base.distribution_capability_labels || [];
  base.distribution_quality_bucket_ids = base.distribution_quality_bucket_ids || [];
  base.target_criterion_ids = base.target_criterion_ids || [];
  base.target_criterion_summaries = base.target_criterion_summaries || [];
  base.target_industries = base.target_industries || [];
  base.target_verticals = base.target_verticals || [];
  base.target_skills = base.target_skills || [];
  base.target_roles = base.target_roles || [];
  base.target_product_types = base.target_product_types || [];
  base.target_raised_capital_range_ids = base.target_raised_capital_range_ids || [];
  base.target_raised_capital_range_labels = base.target_raised_capital_range_labels || [];
  base.target_company_headcount_ranges = base.target_company_headcount_ranges || [];
  base.target_engineering_headcount_ranges = base.target_engineering_headcount_ranges || [];
  base.target_distribution_capability_ids = base.target_distribution_capability_ids || [];
  base.target_distribution_capability_labels = base.target_distribution_capability_labels || [];
  base.target_location_cities = base.target_location_cities || [];
  base.target_location_countries = base.target_location_countries || [];
  base.target_foundation_years = base.target_foundation_years || [];
  base.target_mrr_ranges = base.target_mrr_ranges || [];
  base.target_company_ids = base.target_company_ids || [];
  base.experience_company_ids = base.experience_company_ids || [];

  const flattened = flatteningService.flatten({
    contact: base,
    experiences: base.experiences,
    distributionCapabilities: distribution_capabilities,
    targetCriteria: target_criteria,
    raisedCapitalRanges: base.raised_capital_range_ids,
    companies
  });

  const stageCounts = base.stage_counts;
  const actionStatus = base.action_status ?? deriveActionStatus(stageCounts);

  const contactData: ContactInput = {
    ...base,
    ...flattened.contactUpdates,
    experiences: base.experiences,
    experience_company_ids: flattened.experienceCompanyIds,
    action_status: actionStatus
  };

  return {
    contact: contactData,
    normalizedCompanies: flattened.companies,
    distributionCapabilities: flattened.distributionCapabilities,
    distributionQualityBuckets: flattened.distributionQualityBuckets
  };
}

function stripContactSystemFields(contact: Contact): ContactInput {
  const {
    id: _ignore,
    created_at: _created,
    updated_at: _updated,
    ...rest
  } = contact;
  return rest as ContactInput;
}

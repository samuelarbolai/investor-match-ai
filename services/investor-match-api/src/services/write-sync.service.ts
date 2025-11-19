import { db, getCollection, Timestamp, admin } from '../config/firebase';
import { Contact } from '../models/contact.model';
import { AttributeDocument } from '../models/attribute.model';
import { REVERSE_INDEX_MAPPING, REVERSE_INDEX_FIELDS, ReverseIndexField } from '../config/reverse-index-mapping';
import { ensureValidDocumentId } from '../utils/document-id';

/**
 * Write Synchronization Service
 * Implements all required write rules from schema:
 * 1. Forward edges (Contact updates)
 * 2. Reverse indexes (contact_ids synchronization)
 * 3. Missing docs auto-creation
 * 4. Timestamp updates
 * 5. Atomic array replacements
 * 6. Uniqueness enforcement
 */
export class WriteSyncService {
  
  /**
   * Synchronize reverse indexes when a contact is created or updated
   * @param contactId - Contact document ID
   * @param oldContact - Previous contact state (null for new contacts)
   * @param newContact - New contact state
   */
  async syncReverseIndexes(
    contactId: string,
    oldContact: Contact | null,
    newContact: Contact
  ): Promise<void> {
    console.log('Starting reverse index sync for contact:', contactId);
    const batch = db.batch();
    
    // Process each reverse index field
    for (const field of REVERSE_INDEX_FIELDS) {
      const mapping = REVERSE_INDEX_MAPPING[field];
      const oldValues = oldContact?.[field] || [];
      const newValues = newContact[field] || [];
      
      console.log(`Processing field ${field}:`, { oldValues, newValues });
      
      // Find values to remove (in old but not in new)
      const toRemove = oldValues.filter(value => !newValues.includes(value));
      
      // Find values to add (in new but not in old)
      const toAdd = newValues.filter(value => !oldValues.includes(value));
      
      console.log(`Field ${field} - toAdd:`, toAdd, 'toRemove:', toRemove);
      
      // Remove contact from old attribute docs
      for (const value of toRemove) {
        const docId = ensureValidDocumentId(value);
        const docRef = getCollection(mapping.collection).doc(docId);
        
        batch.update(docRef, {
          contact_ids: admin.firestore.FieldValue.arrayRemove(contactId),
          updated_at: Timestamp.now()
        });
      }
      
      // Add contact to new attribute docs (create if missing)
      for (const value of toAdd) {
        const docId = ensureValidDocumentId(value);
        const docRef = getCollection(mapping.collection).doc(docId);
        
        console.log(`Creating/updating ${mapping.collection}/${docId}`);
        
        // Check if document exists, create if missing
        const doc = await docRef.get();
        if (!doc.exists) {
          console.log(`Creating missing attribute doc: ${mapping.collection}/${docId}`);
          await this.createMissingAttributeDoc(docRef, docId, value);
        }
        
        batch.update(docRef, {
          contact_ids: admin.firestore.FieldValue.arrayUnion(contactId),
          updated_at: Timestamp.now()
        });
      }
    }
    
    // Commit all changes atomically
    console.log('Committing batch updates...');
    await batch.commit();
    console.log('Reverse index sync completed for contact:', contactId);
  }
  
  /**
   * Create missing attribute document with schema structure
   * @param docRef - Firestore document reference
   * @param docId - Document ID
   * @param label - Human-readable label
   */
  private async createMissingAttributeDoc(
    docRef: FirebaseFirestore.DocumentReference,
    docId: string,
    label: string
  ): Promise<void> {
    const attributeDoc: AttributeDocument = {
      id: docId,
      label: label,
      contact_ids: [], // Always array, never null
      updated_at: Timestamp.now()
    };
    
    await docRef.set(attributeDoc);
  }
  
  /**
   * Update contact with timestamp
   * @param contactId - Contact document ID
   * @param updates - Partial contact updates
   */
  async updateContactWithTimestamp(
    contactId: string,
    updates: Partial<Contact>
  ): Promise<void> {
    const contactRef = getCollection('contacts').doc(contactId);
    
    await contactRef.update({
      ...updates,
      updated_at: Timestamp.now()
    });
  }
  
  /**
   * Ensure contact_ids array has unique values only
   * @param attributeDoc - Attribute document to clean
   * @returns Cleaned attribute document
   */
  ensureUniqueContactIds(attributeDoc: AttributeDocument): AttributeDocument {
    return {
      ...attributeDoc,
      contact_ids: [...new Set(attributeDoc.contact_ids)] // Remove duplicates
    };
  }
  
  /**
   * Create or update a contact with full synchronization
   * Implements all write rules atomically
   * @param contactId - Contact document ID
   * @param contactData - Complete contact data
   * @param isUpdate - Whether this is an update (vs create)
   */
  async createOrUpdateContact(
    contactId: string,
    contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>,
    isUpdate: boolean = false
  ): Promise<void> {
    const contactRef = getCollection('contacts').doc(contactId);
    
    // Get old contact for reverse index sync (if updating)
    let oldContact: Contact | null = null;
    if (isUpdate) {
      const oldDoc = await contactRef.get();
      oldContact = oldDoc.exists ? oldDoc.data() as Contact : null;
    }
    
    // Prepare new contact document
    const now = Timestamp.now();
    const newContact: Contact = {
      ...contactData,
      id: contactId,
      created_at: isUpdate && oldContact ? oldContact.created_at : now,
      updated_at: now
    };
    
    // Update contact document (forward edges)
    await contactRef.set(newContact);
    
    // Synchronize reverse indexes
    await this.syncReverseIndexes(contactId, oldContact, newContact);
  }
  
  /**
   * Delete a contact and clean up all reverse indexes
   * @param contactId - Contact document ID to delete
   */
  async deleteContact(contactId: string): Promise<void> {
    const contactRef = getCollection('contacts').doc(contactId);
    
    // Get contact data for cleanup
    const contactDoc = await contactRef.get();
    if (!contactDoc.exists) {
      throw new Error(`Contact ${contactId} not found`);
    }
    
    const contact = contactDoc.data() as Contact;
    
    // Remove from all reverse indexes
    await this.syncReverseIndexes(contactId, contact, {
      ...contact,
      // Set all reverse index fields to empty arrays
      job_to_be_done: [],
      skills: [],
      industries: [],
      verticals: [],
      product_types: [],
      distribution_capability_ids: [],
      distribution_quality_bucket_ids: [],
      funding_stages: [],
      company_headcount_ranges: [],
      engineering_headcount_ranges: [],
      target_domains: [],
      roles: []
    });
    
    // Delete contact document
    await contactRef.delete();
  }
}

// Export singleton instance
export const writeSyncService = new WriteSyncService();

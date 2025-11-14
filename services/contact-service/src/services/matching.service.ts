import { collections } from '../config/firebase';
import { Contact, ContactType } from '../models/contact.model';
import { REVERSE_INDEX_MAPPING, REVERSE_INDEX_FIELDS } from '../config/reverse-index-mapping';

/**
 * Match result interface
 */
export interface MatchResult {
  candidates: MatchCandidate[];
  totalMatches: number;
  seedContact: Contact;
}

/**
 * Individual match candidate
 */
export interface MatchCandidate {
  contact: Contact;
  score: number;
  overlaps: AttributeOverlap[];
}

/**
 * Attribute overlap details
 */
export interface AttributeOverlap {
  attribute: string;
  collection: string;
  values: string[];
}

/**
 * Matching Service - Core algorithm for founder-investor matching
 */
export class MatchingService {
  
  /**
   * Find matching contacts based on shared attributes
   * @param seedId - Contact ID to find matches for
   * @param targetType - Type of contacts to match with (founder/investor)
   * @param limit - Maximum number of results
   */
  async matchContact(
    seedId: string,
    targetType: ContactType,
    limit: number = 20
  ): Promise<MatchResult> {
    console.log(`Starting match for contact ${seedId}, targeting ${targetType}`);
    
    // Get seed contact
    const seedDoc = await collections.contacts().doc(seedId).get();
    if (!seedDoc.exists) {
      throw new Error(`Contact ${seedId} not found`);
    }
    const seedContact = seedDoc.data() as Contact;
    
    // Score map: contactId -> score
    const scores: Map<string, number> = new Map();
    // Overlap map: contactId -> overlaps
    const overlaps: Map<string, AttributeOverlap[]> = new Map();
    
    // Process each reverse index field
    for (const field of REVERSE_INDEX_FIELDS) {
      const mapping = REVERSE_INDEX_MAPPING[field];
      const seedValues = seedContact[field] || [];
      
      if (seedValues.length === 0) continue;
      
      console.log(`Processing ${field} with values:`, seedValues);
      
      // For each value, get contacts that share it
      for (const value of seedValues) {
        try {
          const attrDoc = await collections[this.getCollectionMethod(mapping.collection)]()
            .doc(value)
            .get();
          
          if (!attrDoc.exists) continue;
          
          const attributeData = attrDoc.data();
          const contactIds = attributeData?.contact_ids || [];
          
          // Score each candidate contact
          for (const candidateId of contactIds) {
            if (candidateId === seedId) continue; // Skip self
            
            // Increment score
            const currentScore = scores.get(candidateId) || 0;
            scores.set(candidateId, currentScore + 1);
            
            // Track overlap
            if (!overlaps.has(candidateId)) {
              overlaps.set(candidateId, []);
            }
            
            const candidateOverlaps = overlaps.get(candidateId)!;
            let existingOverlap = candidateOverlaps.find(o => o.collection === mapping.collection);
            
            if (!existingOverlap) {
              existingOverlap = {
                attribute: field,
                collection: mapping.collection,
                values: []
              };
              candidateOverlaps.push(existingOverlap);
            }
            
            existingOverlap.values.push(value);
          }
        } catch (error) {
          console.error(`Error processing ${field}:${value}:`, error);
        }
      }
    }
    
    console.log(`Found ${scores.size} potential matches`);
    
    // Get top candidates and filter by contact type
    const sortedCandidates = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by score descending
      .slice(0, limit * 2); // Get more than needed for filtering
    
    // Fetch candidate contacts and filter by type
    const candidates: MatchCandidate[] = [];
    
    for (const [candidateId, score] of sortedCandidates) {
      if (candidates.length >= limit) break;
      
      try {
        const candidateDoc = await collections.contacts().doc(candidateId).get();
        if (!candidateDoc.exists) continue;
        
        const candidateContact = candidateDoc.data() as Contact;
        
        // Filter by contact type
        if (candidateContact.contact_type !== targetType && candidateContact.contact_type !== 'both') {
          continue;
        }
        
        candidates.push({
          contact: candidateContact,
          score,
          overlaps: overlaps.get(candidateId) || []
        });
      } catch (error) {
        console.error(`Error fetching candidate ${candidateId}:`, error);
      }
    }
    
    console.log(`Returning ${candidates.length} filtered matches`);
    
    return {
      candidates,
      totalMatches: candidates.length,
      seedContact
    };
  }
  
  /**
   * Get collection method name from collection string
   */
  private getCollectionMethod(collectionName: string): keyof typeof collections {
    const methodMap: Record<string, keyof typeof collections> = {
      'jobToBeDone': 'jobToBeDone',
      'skills': 'skills',
      'industries': 'industries',
      'verticals': 'verticals',
      'productTypes': 'productTypes',
      'fundingStages': 'fundingStages',
      'companyHeadcountRanges': 'companyHeadcountRanges',
      'engineeringHeadcountRanges': 'engineeringHeadcountRanges',
      'targetDomains': 'targetDomains',
      'roles': 'roles'
    };
    
    return methodMap[collectionName] || 'skills';
  }
}

// Export singleton instance
export const matchingService = new MatchingService();

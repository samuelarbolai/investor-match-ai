import { collections } from '../config/firebase';
import { Contact, ContactType, StageCounts } from '../models/contact.model';
import { IntroStage, INTRO_STAGES } from '../models/introduction.model';
import { REVERSE_INDEX_MAPPING, REVERSE_INDEX_FIELDS } from '../config/reverse-index-mapping';

export interface MatchResult {
  candidates: MatchCandidate[];
  totalMatches: number;
  seedContact: Contact;
  attributes_used?: string[];
}

export interface MatchCandidate {
  contact: Contact;
  score: number;
  overlaps: AttributeOverlap[];
}

export interface AttributeOverlap {
  attribute: string;
  collection: string;
  values: string[];
}

export interface FilterCriteria {
  contact_type?: ContactType;
  skills?: string[];
  industries?: string[];
  verticals?: string[];
  funding_stages?: string[];
  location_city?: string;
  location_country?: string;
  match_mode?: 'any' | 'all';
  limit?: number;
  stage_count_filters?: StageCountFilters;
}

export interface FilterResult {
  data: Contact[];
  total: number;
  filters_applied: FilterCriteria;
}

export interface CampaignAnalysis {
  contact: Contact;
  combinations: {
    attributes: string[];
    match_count: number;
    description: string;
  }[];
}

interface StageCountRange {
  min?: number;
  max?: number;
}

type StageCountFilters = Partial<Record<IntroStage, StageCountRange>>;

export class MatchingService {
  
  /**
   * Filter contacts by multiple attributes
   */
  async filterContacts(criteria: FilterCriteria): Promise<FilterResult> {
    console.log('Filtering contacts with criteria:', criteria);
    
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
      stage_count_filters
    } = criteria;

    // Collect candidate contact IDs from reverse indexes
    const candidateScores: Map<string, number> = new Map();
    
    // Helper to process array filters
    const processArrayFilter = async (
      values: string[] | undefined,
      collectionMethod: keyof typeof collections
    ) => {
      if (!values || values.length === 0) return;
      
      for (const value of values) {
        try {
          const doc = await collections[collectionMethod]().doc(value).get();
          if (!doc.exists) continue;
          
          const contactIds = doc.data()?.contact_ids || [];
          for (const contactId of contactIds) {
            candidateScores.set(contactId, (candidateScores.get(contactId) || 0) + 1);
          }
        } catch (error) {
          console.error(`Error processing ${collectionMethod}:${value}:`, error);
        }
      }
    };

    // Process each filter type
    await processArrayFilter(skills, 'skills');
    await processArrayFilter(industries, 'industries');
    await processArrayFilter(verticals, 'verticals');
    await processArrayFilter(funding_stages, 'fundingStages');

    // Get all candidates or start with all contacts if no array filters
    let candidateIds: string[] = [];
    
    if (candidateScores.size > 0) {
      candidateIds = Array.from(candidateScores.keys());
    } else {
      // No array filters - get all contacts
      const snapshot = await collections.contacts().limit(1000).get();
      candidateIds = snapshot.docs.map(doc => doc.id);
    }

    console.log(`Found ${candidateIds.length} candidates from reverse indexes`);

    // Fetch and filter contacts
    const filteredContacts: Contact[] = [];
    
    for (const candidateId of candidateIds) {
      if (filteredContacts.length >= limit) break;
      
      try {
        const doc = await collections.contacts().doc(candidateId).get();
        if (!doc.exists) continue;
        
        const contact = doc.data() as Contact;
        
        // Apply filters
        if (contact_type && contact.contact_type !== contact_type && contact.contact_type !== 'both') {
          continue;
        }
        
        if (location_city && contact.location_city !== location_city) {
          continue;
        }
        
        if (location_country && contact.location_country !== location_country) {
          continue;
        }
        
        // For 'all' mode, check if contact matches ALL provided array filters
        if (match_mode === 'all') {
          let matchesAll = true;
          
          if (skills && skills.length > 0) {
            const hasSkill = skills.some(s => contact.skills?.includes(s));
            if (!hasSkill) matchesAll = false;
          }
          
          if (industries && industries.length > 0) {
            const hasIndustry = industries.some(i => contact.industries?.includes(i));
            if (!hasIndustry) matchesAll = false;
          }
          
          if (verticals && verticals.length > 0) {
            const hasVertical = verticals.some(v => contact.verticals?.includes(v));
            if (!hasVertical) matchesAll = false;
          }
          
          if (funding_stages && funding_stages.length > 0) {
            const hasStage = funding_stages.some(f => contact.funding_stages?.includes(f));
            if (!hasStage) matchesAll = false;
          }
          
          if (!matchesAll) continue;
        }

        if (!this.matchesStageCountFilters(contact.stage_counts, stage_count_filters)) {
          continue;
        }
        
        filteredContacts.push(contact);
      } catch (error) {
        console.error(`Error fetching contact ${candidateId}:`, error);
      }
    }

    console.log(`Returning ${filteredContacts.length} filtered contacts`);

    return {
      data: filteredContacts,
      total: filteredContacts.length,
      filters_applied: criteria
    };
  }

  private matchesStageCountFilters(
    counts: StageCounts | undefined,
    filters?: StageCountFilters
  ): boolean {
    if (!filters) {
      return true;
    }

    const normalized: StageCounts = INTRO_STAGES.reduce((acc, stage) => {
      acc[stage] = counts?.[stage] ?? 0;
      return acc;
    }, {} as StageCounts);

    return Object.entries(filters).every(([stage, range]) => {
      if (!range) {
        return true;
      }
      const value = normalized[stage as IntroStage] ?? 0;
      if (typeof range.min === 'number' && value < range.min) {
        return false;
      }
      if (typeof range.max === 'number' && value > range.max) {
        return false;
      }
      return true;
    });
  }

  /**
   * Campaign-style matching: match using only specified attributes
   */
  async campaignMatch(
    seedId: string,
    attributes: string[],
    targetType: ContactType,
    limit: number = 20
  ): Promise<MatchResult> {
    console.log(`Campaign match for ${seedId} using attributes:`, attributes);
    
    // Get seed contact
    const seedDoc = await collections.contacts().doc(seedId).get();
    if (!seedDoc.exists) {
      throw new Error(`Contact ${seedId} not found`);
    }
    const seedContact = seedDoc.data() as Contact;
    
    // Map user-friendly attribute names to field names
    const attributeFieldMap: Record<string, string[]> = {
      'skills': ['skills'],
      'industries': ['industries'],
      'verticals': ['verticals'],
      'funding_stages': ['funding_stages'],
      'location': ['location_city', 'location_country']
    };
    
    // Get fields to process based on selected attributes
    const fieldsToProcess: string[] = [];
    for (const attr of attributes) {
      const fields = attributeFieldMap[attr];
      if (fields) {
        fieldsToProcess.push(...fields);
      }
    }
    
    if (fieldsToProcess.length === 0) {
      return {
        candidates: [],
        totalMatches: 0,
        seedContact,
        attributes_used: attributes
      };
    }
    
    // Score map: contactId -> score
    const scores: Map<string, number> = new Map();
    const overlaps: Map<string, AttributeOverlap[]> = new Map();
    
    // Process only selected fields
    for (const field of fieldsToProcess) {
      // Handle location separately (not in reverse index)
      if (field === 'location_city' || field === 'location_country') {
        continue; // Handle in filtering step
      }
      
      // Type guard to ensure field is a valid reverse index field
      if (!REVERSE_INDEX_FIELDS.includes(field as typeof REVERSE_INDEX_FIELDS[number])) {
        continue;
      }
      
      const mapping = REVERSE_INDEX_MAPPING[field as typeof REVERSE_INDEX_FIELDS[number]];
      const seedValues = seedContact[field as keyof Contact] as string[] | undefined || [];
      
      if (seedValues.length === 0) continue;
      
      console.log(`Processing ${field} with values:`, seedValues);
      
      for (const value of seedValues) {
        try {
          const attrDoc = await collections[this.getCollectionMethod(mapping.collection)]()
            .doc(value)
            .get();
          
          if (!attrDoc.exists) continue;
          
          const attributeData = attrDoc.data();
          const contactIds = attributeData?.contact_ids || [];
          
          for (const candidateId of contactIds) {
            if (candidateId === seedId) continue;
            
            scores.set(candidateId, (scores.get(candidateId) || 0) + 1);
            
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
    
    // Handle location filtering if selected
    const useLocationFilter = attributes.includes('location');
    
    // Get top candidates
    const sortedCandidates = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit * 2);
    
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
        
        // Filter by location if selected
        if (useLocationFilter) {
          const cityMatch = seedContact.location_city === candidateContact.location_city;
          const countryMatch = seedContact.location_country === candidateContact.location_country;
          
          if (!cityMatch && !countryMatch) {
            continue;
          }
          
          // Add location to overlaps if it matches
          if (cityMatch || countryMatch) {
            const candidateOverlaps = overlaps.get(candidateId) || [];
            candidateOverlaps.push({
              attribute: 'location',
              collection: 'location',
              values: cityMatch ? [seedContact.location_city || ''] : [seedContact.location_country || '']
            });
            overlaps.set(candidateId, candidateOverlaps);
          }
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
    
    console.log(`Returning ${candidates.length} campaign matches`);
    
    return {
      candidates,
      totalMatches: candidates.length,
      seedContact,
      attributes_used: attributes
    };
  }

  /**
   * Analyze match potential across different attribute combinations
   */
  async analyzeCampaignPotential(
    seedId: string,
    targetType: ContactType
  ): Promise<CampaignAnalysis> {
    const seedDoc = await collections.contacts().doc(seedId).get();
    if (!seedDoc.exists) {
      throw new Error(`Contact ${seedId} not found`);
    }
    const seedContact = seedDoc.data() as Contact;
    
    const attributeCombinations = [
      { attrs: ['location'], desc: 'Location only' },
      { attrs: ['industries'], desc: 'Industry only' },
      { attrs: ['funding_stages'], desc: 'Funding stage only' },
      { attrs: ['skills'], desc: 'Skills only' },
      { attrs: ['industries', 'location'], desc: 'Industry + Location' },
      { attrs: ['industries', 'funding_stages'], desc: 'Industry + Stage' },
      { attrs: ['industries', 'funding_stages', 'location'], desc: 'Industry + Stage + Location' },
      { attrs: ['skills', 'industries', 'verticals', 'funding_stages', 'location'], desc: 'All attributes' }
    ];
    
    const results = [];
    
    for (const combo of attributeCombinations) {
      try {
        const matchResult = await this.campaignMatch(seedId, combo.attrs, targetType, 100);
        results.push({
          attributes: combo.attrs,
          match_count: matchResult.totalMatches,
          description: combo.desc
        });
      } catch (error) {
        console.error(`Error analyzing combination ${combo.desc}:`, error);
      }
    }
    
    return {
      contact: seedContact,
      combinations: results
    };
  }

  /**
   * Original match method - kept for backward compatibility
   */
  async matchContact(
    seedId: string,
    targetType: ContactType,
    limit: number = 20
  ): Promise<MatchResult> {
    // Use all attributes for backward compatibility
    return this.campaignMatch(
      seedId,
      ['skills', 'industries', 'verticals', 'funding_stages', 'location'],
      targetType,
      limit
    );
  }
  
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

export const matchingService = new MatchingService();

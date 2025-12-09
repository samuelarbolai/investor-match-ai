import { collections } from '../config/firebase';
import { Contact, ContactType, StageCounts } from '../models/contact.model';
import { IntroStage, INTRO_STAGES } from '../models/introduction.model';
import { REVERSE_INDEX_MAPPING, REVERSE_INDEX_FIELDS } from '../config/reverse-index-mapping';
import { ensureValidDocumentId } from '../utils/document-id';

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
  company_names?: string[];
  company_scope?: CompanyScope;
  exclude_tags?: string[];
  tags?: string[];
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
type CompanyScope = 'current' | 'experience' | 'any';

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
      stage_count_filters,
      company_names,
      company_scope,
      exclude_tags,
      tags
    } = criteria;

    const excludeSet = new Set((exclude_tags || []).map(tag => this.normalizeTag(tag)).filter(Boolean) as string[]);
    const includeSet = new Set((tags || []).map(tag => this.normalizeTag(tag)).filter(Boolean) as string[]);

    const normalizedCompanyNames = this.normalizeCompanyNames(company_names);
    const normalizedCompanySlugs = normalizedCompanyNames.map(name => ensureValidDocumentId(name));
    const normalizedCompanyScope = this.normalizeCompanyScope(company_scope);

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
        
        // Apply tag filters
        const contactTag = this.normalizeTag(contact.tag);

        // If tags (include) is specified, ONLY include contacts with those tags
        if (includeSet.size > 0) {
          if (!contactTag || !includeSet.has(contactTag)) {
            continue;
          }
        }

        // If exclude_tags is specified, exclude contacts with those tags
        if (excludeSet.size > 0) {
          if (contactTag && excludeSet.has(contactTag)) {
            continue;
          }
        }

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

        if (!this.matchesCompanyFilter(contact, normalizedCompanyNames, normalizedCompanySlugs, normalizedCompanyScope)) {
          continue;
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
      filters_applied: { ...criteria, exclude_tags: Array.from(excludeSet) }
    };
  }

  private normalizeCompanyNames(names?: string[]): string[] {
    if (!names) {
      return [];
    }
    return names
      .map(name => (typeof name === 'string' ? name.trim().toLowerCase() : ''))
      .filter((name): name is string => Boolean(name));
  }

  private normalizeCompanyScope(scope?: string): CompanyScope {
    if (!scope) {
      return 'any';
    }
    const lowered = scope.toLowerCase() as CompanyScope;
    return ['current', 'experience', 'any'].includes(lowered) ? lowered : 'any';
  }

  private matchesCompanyFilter(
    contact: Contact,
    companyNames: string[],
    companySlugs: string[],
    scope: CompanyScope
  ): boolean {
    if (companyNames.length === 0) {
      return true;
    }

    const matchesCurrent = this.matchesSingleCompany(
      contact.current_company,
      contact.current_company_id,
      companyNames,
      companySlugs
    );

    const matchesExperience = this.hasExperienceCompanyMatch(
      contact,
      companyNames,
      companySlugs
    );

    switch (scope) {
      case 'current':
        return matchesCurrent;
      case 'experience':
        return matchesExperience;
      default:
        return matchesCurrent || matchesExperience;
    }
  }

  private matchesSingleCompany(
    name: string | null | undefined,
    id: string | null | undefined,
    companyNames: string[],
    companySlugs: string[]
  ): boolean {
    const normalizedName = this.normalizeCompanyName(name);
    if (normalizedName && companyNames.includes(normalizedName)) {
      return true;
    }

    const candidateSlug = id || (normalizedName ? ensureValidDocumentId(normalizedName) : null);
    return candidateSlug ? companySlugs.includes(candidateSlug) : false;
  }

  private hasExperienceCompanyMatch(
    contact: Contact,
    companyNames: string[],
    companySlugs: string[]
  ): boolean {
    const experienceMatch = (contact.experiences || []).some(exp =>
      this.matchesSingleCompany(exp.company_name, exp.company_id, companyNames, companySlugs)
    );

    if (experienceMatch) {
      return true;
    }

    const pastMatches = (contact.past_companies || []).some(name =>
      this.matchesSingleCompany(name, name ? ensureValidDocumentId(name) : null, companyNames, companySlugs)
    );

    return pastMatches;
  }

  private normalizeCompanyName(name?: string | null): string | null {
    if (typeof name !== 'string') {
      return null;
    }
    const normalized = name.trim().toLowerCase();
    return normalized.length ? normalized : null;
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
    limit: number = 20,
    excludeTags: string[] = []
  ): Promise<MatchResult> {
    console.log(`Campaign match for ${seedId} using attributes:`, attributes);
    
    // Get seed contact
    const seedDoc = await collections.contacts().doc(seedId).get();
    if (!seedDoc.exists) {
      throw new Error(`Contact ${seedId} not found`);
    }
    const seedContact = seedDoc.data() as Contact;
    const excluded = new Set(
      (excludeTags || [])
        .map(tag => this.normalizeTag(tag))
        .filter((tag): tag is string => Boolean(tag))
    );
    
    // Map user-friendly attribute names to field names
    const attributeFieldMap: Record<string, { current: string[]; target: string[] }> = {
      'skills': { current: ['skills'], target: ['target_skills'] },
      'industries': { current: ['industries'], target: ['target_industries'] },
      'verticals': { current: ['verticals'], target: ['target_verticals'] },
      'funding_stages': { current: ['funding_stages'], target: ['target_raised_capital_range_ids'] },
      'location': { current: ['location_city', 'location_country'], target: ['target_location_cities', 'target_location_countries'] }
    };
    const useTargetAttributes = this.shouldUseTargetAttributes(seedContact, targetType);
    
    // Get fields to process based on selected attributes
    const fieldsToProcess: string[] = [];
    for (const attr of attributes) {
      const fieldConfig = attributeFieldMap[attr];
      if (fieldConfig) {
        fieldsToProcess.push(...(useTargetAttributes ? fieldConfig.target : fieldConfig.current));
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
      if (field === 'location_city' || field === 'location_country' || field === 'target_location_cities' || field === 'target_location_countries') {
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
    const seedLocationCities = useTargetAttributes ? (seedContact.target_location_cities || []) : (seedContact.location_city ? [seedContact.location_city] : []);
    const seedLocationCountries = useTargetAttributes ? (seedContact.target_location_countries || []) : (seedContact.location_country ? [seedContact.location_country] : []);
    
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

        if (excluded.size > 0) {
          const tag = this.normalizeTag(candidateContact.tag);
          if (tag && excluded.has(tag)) {
            continue;
          }
        }
        
        // Filter by contact type
        if (candidateContact.contact_type !== targetType && candidateContact.contact_type !== 'both') {
          continue;
        }
        
        // Filter by location if selected
        if (useLocationFilter) {
          let locationMatched = false;
          let matchedValue: string | null = null;
          
          if (useTargetAttributes) {
            const candidateCity = candidateContact.location_city || '';
            const candidateCountry = candidateContact.location_country || '';
            if (seedLocationCities.includes(candidateCity) && candidateCity) {
              locationMatched = true;
              matchedValue = candidateCity;
            } else if (seedLocationCountries.includes(candidateCountry) && candidateCountry) {
              locationMatched = true;
              matchedValue = candidateCountry;
            }
          } else {
            const cityMatch = seedContact.location_city === candidateContact.location_city;
            const countryMatch = seedContact.location_country === candidateContact.location_country;
            locationMatched = cityMatch || countryMatch;
            matchedValue = cityMatch ? seedContact.location_city : seedContact.location_country;
          }
          
          if (!locationMatched) {
            continue;
          }
          
          if (matchedValue) {
            const candidateOverlaps = overlaps.get(candidateId) || [];
            candidateOverlaps.push({
              attribute: 'location',
              collection: 'location',
              values: [matchedValue]
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
    limit: number = 20,
    excludeTags: string[] = []
  ): Promise<MatchResult> {
    // Use all attributes for backward compatibility
    return this.campaignMatch(
      seedId,
      ['skills', 'industries', 'verticals', 'funding_stages', 'location'],
      targetType,
      limit,
      excludeTags
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
      'roles': 'roles',
      'raisedCapitalRanges': 'raisedCapitalRanges',
      'distributionCapabilities': 'distributionCapabilities',
      'companies': 'companies'
    };
    
    return methodMap[collectionName] || 'skills';
  }
  
  private shouldUseTargetAttributes(seedContact: Contact, targetType: ContactType): boolean {
    if (targetType === 'founder') {
      // investors (or both acting as investors) targeting founders should use target_* arrays
      return seedContact.contact_type === 'investor' || seedContact.contact_type === 'both';
    }
    return false;
  }

  private normalizeTag(tag?: string | null): string | null {
    if (!tag || typeof tag !== 'string') {
      return null;
    }
    const normalized = tag.trim().toLowerCase();
    return normalized.length ? normalized : null;
  }
}

export const matchingService = new MatchingService();

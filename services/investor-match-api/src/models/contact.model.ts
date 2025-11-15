import { Timestamp } from 'firebase-admin/firestore';
import { Experience } from './experience.model';

/**
 * Contact type enum - founder, investor, or both
 */
export type ContactType = 'founder' | 'investor' | 'both';

/**
 * Complete Contact interface matching Firestore schema
 * All fields correspond to /contacts/{contactId} document structure
 */
export interface Contact {
  /** Document ID */
  id: string;
  
  /** Full name of the contact */
  full_name: string;
  
  /** Professional headline */
  headline: string;
  
  /** Contact type: founder, investor, or both */
  contact_type: ContactType;
  
  /** Location city (nullable) */
  location_city: string | null;
  
  /** Location country (nullable) */
  location_country: string | null;
  
  /** Job to be done array - maps to jobToBeDone collection */
  job_to_be_done: string[];
  
  /** Current company name (nullable) */
  current_company: string | null;
  
  /** Current role (nullable) */
  current_role: string | null;
  
  /** Past companies array */
  past_companies: string[];
  
  /** Roles array - maps to roles collection */
  roles: string[];
  
  /** Skills array - maps to skills collection */
  skills: string[];
  
  /** Seniority levels array */
  seniority_levels: string[];
  
  /** Industries array - maps to industries collection */
  industries: string[];
  
  /** Verticals array - maps to verticals collection */
  verticals: string[];
  
  /** Product types array - maps to productTypes collection */
  product_types: string[];
  
  /** Funding stages array - maps to fundingStages collection */
  funding_stages: string[];
  
  /** Company headcount ranges array - maps to companyHeadcountRanges collection */
  company_headcount_ranges: string[];
  
  /** Engineering headcount ranges array - maps to engineeringHeadcountRanges collection */
  engineering_headcount_ranges: string[];
  
  /** Founder roles array */
  founder_roles: string[];
  
  /** Investor roles array */
  investor_roles: string[];
  
  /** Target domains array - maps to targetDomains collection */
  target_domains: string[];
  
  /** Stage preferences array */
  stage_preferences: string[];
  
  /** Check size range array */
  check_size_range: string[];
  
  /** Team size preferences array */
  team_size_preferences: string[];
  
  /** Founder seniority preferences array */
  founder_seniority_preferences: string[];
  
  /** Engineering headcount preferences array */
  engineering_headcount_preferences: string[];
  
  /** Revenue model preferences array */
  revenue_model_preferences: string[];
  
  /** Risk tolerance preferences array */
  risk_tolerance_preferences: string[];
  
  /** Embedded experiences array */
  experiences: Experience[];
  
  /** LinkedIn URL (nullable) */
  linkedin_url: string | null;
  
  /** Email address (nullable) */
  email: string | null;
  
  /** Document creation timestamp */
  created_at: Timestamp;
  
  /** Document last update timestamp */
  updated_at: Timestamp;
}

/**
 * Contact input type for API requests (excludes auto-generated fields)
 */
export type ContactInput = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;

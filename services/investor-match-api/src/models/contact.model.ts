import { Timestamp } from 'firebase-admin/firestore';
import { Experience } from './experience.model';
import { IntroStage } from './introduction.model';

/**
 * Contact type enum - founder, investor, or both
 */
export type ContactType = 'founder' | 'investor' | 'both';
export type ActionStatus = 'action_required' | 'waiting';

/**
 * Complete Contact interface matching Firestore schema
 * All fields correspond to /contacts/{contactId} document structure
 */
export interface Contact {
  /** Document ID */
  id: string;

  /** Optional tag used for dataset partitioning (e.g., coverage, test) */
  tag?: string | null;
  
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
  
  /** Current company normalized ID (nullable) */
  current_company_id: string | null;
  
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
  
  /** Raised capital range IDs - maps to raisedCapitalRanges collection */
  raised_capital_range_ids: string[];
  
  /** Raised capital range labels for flattened reads */
  raised_capital_range_labels: string[];
  
  /** Legacy funding stages array (deprecated) */
  funding_stages?: string[];
  
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
  
  /** Distribution capability IDs - maps to distributionCapabilities collection */
  distribution_capability_ids: string[];
  
  /** Distribution capability labels for flattened reads */
  distribution_capability_labels: string[];

  /** Distribution capability quality bucket IDs used for reverse indexing by quality */
  distribution_quality_bucket_ids: string[];
  
  /** Target criterion IDs - maps to targetCriteria collection */
  target_criterion_ids: string[];
  
  /** Human-readable target criterion summaries */
  target_criterion_summaries: string[];
  
  /** Targeted industries from investor thesis */
  target_industries: string[];
  
  /** Targeted verticals from investor thesis */
  target_verticals: string[];
  
  /** Targeted skills */
  target_skills: string[];
  
  /** Targeted roles */
  target_roles: string[];
  
  /** Targeted product types */
  target_product_types: string[];
  
  /** Targeted raised capital range IDs */
  target_raised_capital_range_ids: string[];
  
  /** Targeted raised capital labels */
  target_raised_capital_range_labels: string[];
  
  /** Targeted company headcount ranges */
  target_company_headcount_ranges: string[];
  
  /** Targeted engineering headcount ranges */
  target_engineering_headcount_ranges: string[];
  
  /** Targeted distribution capability IDs */
  target_distribution_capability_ids: string[];
  
  /** Targeted distribution capability labels */
  target_distribution_capability_labels: string[];
  
  /** Targeted location cities */
  target_location_cities: string[];
  
  /** Targeted location countries */
  target_location_countries: string[];
  
  /** Targeted foundation years */
  target_foundation_years: string[];
  
  /** Targeted MRR ranges */
  target_mrr_ranges: string[];
  
  /** Targeted company IDs */
  target_company_ids: string[];
  
  /** Embedded experiences array */
  experiences: Experience[];
  
  /** Flattened experience company IDs */
  experience_company_ids: string[];
  
  /** Action status flag to highlight funnel needs */
  action_status: ActionStatus;
  
  /** LinkedIn URL (nullable) */
  linkedin_url: string | null;
  
  /** Email address (nullable) */
  email: string | null;
  
  /** Document creation timestamp */
  created_at: Timestamp;
  
  /** Document last update timestamp */
  updated_at: Timestamp;

  /** Cached counts of introductions per stage where this contact is the owner */
  stage_counts?: StageCounts;
}

/**
 * Contact input type for API requests (excludes auto-generated fields)
 */
export type ContactInput = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;

export type StageCounts = Record<IntroStage, number>;

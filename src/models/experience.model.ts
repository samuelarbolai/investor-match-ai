/**
 * Experience object interface for embedded experiences in Contact documents
 * Represents work experience with company, role, and timeline information
 */
export interface Experience {
  /** Company name */
  company_name: string;
  
  /** Optional company ID reference */
  company_id: string | null;
  
  /** Role/position title */
  role: string;
  
  /** Seniority level */
  seniority: string;
  
  /** Start date in YYYY-MM format */
  start_date: string;
  
  /** End date in YYYY-MM format, null if current */
  end_date: string | null;
  
  /** Whether this is the current position */
  current: boolean;
  
  /** Optional description of the role */
  description: string | null;
  
  /** Location city (nullable) */
  location_city: string | null;
  
  /** Location country (nullable) */
  location_country: string | null;
}

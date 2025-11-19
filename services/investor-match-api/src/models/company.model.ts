/**
 * Normalized company node connected to contacts/experiences
 */
export interface Company {
  id: string;
  name: string;
  domain: string | null;
  description: string | null;
  linkedin_url: string | null;
  crunchbase_url: string | null;
  industries: string[];
  verticals: string[];
}

export interface CompanyInput {
  name: string;
  domain?: string | null;
  description?: string | null;
  linkedin_url?: string | null;
  crunchbase_url?: string | null;
  industries?: string[];
  verticals?: string[];
}

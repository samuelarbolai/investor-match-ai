import Joi from 'joi';

export const LIST_CONTACTS_SORT_FIELDS = ['full_name', 'contact_type', 'created_at', 'updated_at'] as const;
export type ListContactsSortField = typeof LIST_CONTACTS_SORT_FIELDS[number];

export const listContactsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  startAfter: Joi.string().optional(),
  order_by: Joi.string().valid(...LIST_CONTACTS_SORT_FIELDS).default('created_at'),
  order_direction: Joi.string().valid('asc', 'desc').default('asc'),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  exclude_tags: Joi.array().items(Joi.string().trim()).optional()
});

export const SORT_FIELD_MAP: Record<ListContactsSortField, string> = {
  full_name: 'full_name',
  contact_type: 'contact_type',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

export const mapSortField = (value: ListContactsSortField): string => SORT_FIELD_MAP[value] ?? 'created_at';

/**
 * Contact creation validation schema
 */
export const createContactSchema = Joi.object({
  full_name: Joi.string().min(1).max(100).required(),
  headline: Joi.string().min(1).max(200).required(),
  contact_type: Joi.string().valid('founder', 'investor', 'both').required(),
  location_city: Joi.string().max(100).allow(null),
  location_country: Joi.string().max(100).allow(null),
  
  // Arrays - must be arrays of strings
  job_to_be_done: Joi.array().items(Joi.string()).default([]),
  skills: Joi.array().items(Joi.string()).default([]),
  industries: Joi.array().items(Joi.string()).default([]),
  verticals: Joi.array().items(Joi.string()).default([]),
  product_types: Joi.array().items(Joi.string()).default([]),
  funding_stages: Joi.array().items(Joi.string()).default([]), // legacy
  raised_capital_range_ids: Joi.array().items(Joi.string()).default([]),
  company_headcount_ranges: Joi.array().items(Joi.string()).default([]),
  engineering_headcount_ranges: Joi.array().items(Joi.string()).default([]),
  founder_roles: Joi.array().items(Joi.string()).default([]),
  investor_roles: Joi.array().items(Joi.string()).default([]),
  target_domains: Joi.array().items(Joi.string()).default([]),
  roles: Joi.array().items(Joi.string()).default([]),
  seniority_levels: Joi.array().items(Joi.string()).default([]),
  past_companies: Joi.array().items(Joi.string()).default([]),
  
  // Preference arrays
  stage_preferences: Joi.array().items(Joi.string()).default([]),
  check_size_range: Joi.array().items(Joi.string()).default([]),
  team_size_preferences: Joi.array().items(Joi.string()).default([]),
  founder_seniority_preferences: Joi.array().items(Joi.string()).default([]),
  engineering_headcount_preferences: Joi.array().items(Joi.string()).default([]),
  revenue_model_preferences: Joi.array().items(Joi.string()).default([]),
  risk_tolerance_preferences: Joi.array().items(Joi.string()).default([]),
  distribution_capability_ids: Joi.array().items(Joi.string()).default([]),
  distribution_capability_labels: Joi.array().items(Joi.string()).default([]),
  distribution_quality_bucket_ids: Joi.array().items(Joi.string()).default([]),
  target_criterion_ids: Joi.array().items(Joi.string()).default([]),
  target_criterion_summaries: Joi.array().items(Joi.string()).default([]),
  target_industries: Joi.array().items(Joi.string()).default([]),
  target_verticals: Joi.array().items(Joi.string()).default([]),
  target_skills: Joi.array().items(Joi.string()).default([]),
  target_roles: Joi.array().items(Joi.string()).default([]),
  target_product_types: Joi.array().items(Joi.string()).default([]),
  target_raised_capital_range_ids: Joi.array().items(Joi.string()).default([]),
  target_raised_capital_range_labels: Joi.array().items(Joi.string()).default([]),
  target_company_headcount_ranges: Joi.array().items(Joi.string()).default([]),
  target_engineering_headcount_ranges: Joi.array().items(Joi.string()).default([]),
  target_distribution_capability_ids: Joi.array().items(Joi.string()).default([]),
  target_distribution_capability_labels: Joi.array().items(Joi.string()).default([]),
  target_location_cities: Joi.array().items(Joi.string()).default([]),
  target_location_countries: Joi.array().items(Joi.string()).default([]),
  target_foundation_years: Joi.array().items(Joi.string()).default([]),
  target_mrr_ranges: Joi.array().items(Joi.string()).default([]),
  target_company_ids: Joi.array().items(Joi.string()).default([]),
  experience_company_ids: Joi.array().items(Joi.string()).default([]),
  action_status: Joi.string().valid('action_required', 'waiting').default('action_required'),
  
  // Optional fields
  current_company: Joi.string().max(100).allow(null),
  current_company_id: Joi.string().max(100).allow(null),
  current_role: Joi.string().max(100).allow(null),
  linkedin_url: Joi.string().uri().allow(null),
  email: Joi.string().email().allow(null),
  tag: Joi.string().trim().max(100).allow(null),
  
  // Experiences array
  experiences: Joi.array().items(
    Joi.object({
      company_name: Joi.string().required(),
      company_id: Joi.string().allow(null),
      role: Joi.string().required(),
      seniority: Joi.string().required(),
      start_date: Joi.string().pattern(/^\d{4}-\d{2}$/).required(), // YYYY-MM
      end_date: Joi.string().pattern(/^\d{4}-\d{2}$/).allow(null),
      current: Joi.boolean().required(),
      description: Joi.string().allow(null),
      location_city: Joi.string().allow(null),
      location_country: Joi.string().allow(null)
    })
  ).default([]),

  // Distribution capabilities payload (normalized later)
  distribution_capabilities: Joi.array().items(
    Joi.object({
      distribution_type: Joi.string().required(),
      label: Joi.string().allow('').optional(),
      size_score: Joi.number().min(0).max(1).allow(null),
      engagement_score: Joi.number().min(0).max(1).allow(null),
      quality_score: Joi.number().min(0).max(1).allow(null),
      source_url: Joi.string().uri().allow(null)
    })
  ).default([]),

  // Target criteria payload (normalized later)
  target_criteria: Joi.array().items(
    Joi.object({
      dimension: Joi.string().required(),
      operator: Joi.string().valid('=', 'in', '>=', '<=', 'between').required(),
      value: Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.array().items(Joi.string()),
        Joi.array().length(2).items(Joi.number())
      ).required(),
      label: Joi.string().optional()
    })
  ).default([]),

  companies: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      domain: Joi.string().allow(null),
      description: Joi.string().allow(null),
      linkedin_url: Joi.string().uri().allow(null),
      crunchbase_url: Joi.string().uri().allow(null)
    })
  ).default([])
});

/**
 * Contact update validation schema (all fields optional)
 */
export const updateContactSchema = createContactSchema.fork(
  ['full_name', 'headline', 'contact_type'],
  (schema) => schema.optional()
);

/**
 * Match query validation schema
 */
export const matchQuerySchema = Joi.object({
  targetType: Joi.string().valid('founder', 'investor', 'both').default('investor'),
  limit: Joi.number().integer().min(1).max(100).default(20),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  exclude_tags: Joi.array().items(Joi.string().trim()).optional()
});

/**
 * Contact ID parameter validation
 */
export const contactIdSchema = Joi.object({
  id: Joi.string().alphanum().min(10).max(30).required()
});

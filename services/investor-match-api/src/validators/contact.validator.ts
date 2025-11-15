import Joi from 'joi';

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
  funding_stages: Joi.array().items(Joi.string()).default([]),
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
  
  // Optional fields
  current_company: Joi.string().max(100).allow(null),
  current_role: Joi.string().max(100).allow(null),
  linkedin_url: Joi.string().uri().allow(null),
  email: Joi.string().email().allow(null),
  
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
  limit: Joi.number().integer().min(1).max(100).default(20)
});

/**
 * Contact ID parameter validation
 */
export const contactIdSchema = Joi.object({
  id: Joi.string().alphanum().min(10).max(30).required()
});

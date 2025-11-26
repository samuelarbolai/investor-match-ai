import Joi from 'joi';

export const campaignContactsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(25),
  startAfter: Joi.string().optional(),
  order_by: Joi.string().valid('stage', 'updated_at').default('stage'),
  order_direction: Joi.string().valid('asc', 'desc').default('asc'),
});

import Joi from 'joi';
import { INTRO_STAGES } from '../models/introduction.model';

const introStages: ReadonlyArray<string> = INTRO_STAGES;

export const setStageSchema = Joi.object({
  ownerId: Joi.string().required(),
  targetId: Joi.string().required(),
  stage: Joi.string().valid(...introStages).required(),
});

export const getContactsInStageSchema = Joi.object({
  ownerId: Joi.string().required(),
  stage: Joi.string().valid(...introStages),
});

export const bulkSetStageSchema = Joi.object({
  ownerId: Joi.string().required(),
  updates: Joi.array().items(
    Joi.object({
      targetId: Joi.string().required(),
      stage: Joi.string().valid(...introStages).required(),
    })
  ).min(1).required(),
});

export const getStageSummarySchema = Joi.object({
  ownerId: Joi.string().required(),
});

import { Timestamp } from 'firebase-admin/firestore';

export const INTRO_STAGES = [
  'prospect',
  'qualified',
  'outreached',
  'interested',
  'to-meet',
  'met',
  'disqualified',
  'not-in-campaign',
] as const;

export type IntroStage = typeof INTRO_STAGES[number];

export const STAGE_RANK: Record<IntroStage, number> = {
  met: 1,
  'to-meet': 2,
  interested: 3,
  qualified: 4,
  outreached: 5,
  prospect: 6,
  disqualified: 7,
  'not-in-campaign': 8,
};

export interface Introduction {
  id?: string;
  ownerId: string;
  targetId: string;
  stage: IntroStage;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stage_rank?: number;
  metadata?: Record<string, unknown>;
}

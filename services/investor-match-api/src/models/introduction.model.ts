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

export interface Introduction {
  id?: string;
  ownerId: string;
  targetId: string;
  stage: IntroStage;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

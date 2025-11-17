import { Timestamp } from 'firebase-admin/firestore';

export const INTRO_STAGES = [
  'prospect',
  'lead',
  'to-meet',
  'met',
  'not-in-campaign',
  'disqualified',
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

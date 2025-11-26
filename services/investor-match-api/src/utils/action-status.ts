import { ActionStatus, StageCounts } from '../models/contact.model';
import { IntroStage } from '../models/introduction.model';

const ACTION_REQUIRED_STAGES: ReadonlyArray<IntroStage> = [
  'qualified',
  'interested',
  'met',
  'disqualified',
];

export function deriveActionStatus(stageCounts?: StageCounts): ActionStatus {
  if (!stageCounts) {
    return 'action_required';
  }

  const actionTotal = ACTION_REQUIRED_STAGES.reduce((sum, stage) => {
    return sum + (stageCounts[stage] ?? 0);
  }, 0);

  return actionTotal > 0 ? 'action_required' : 'waiting';
}

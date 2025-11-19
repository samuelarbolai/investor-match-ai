import { ActionStatus, StageCounts } from '../models/contact.model';

export function deriveActionStatus(stageCounts?: StageCounts): ActionStatus {
  const prospectCount = stageCounts?.prospect ?? 0;
  return prospectCount === 0 ? 'action_required' : 'waiting';
}

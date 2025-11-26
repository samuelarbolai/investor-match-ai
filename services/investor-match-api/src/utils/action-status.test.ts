import { deriveActionStatus } from './action-status';
import { StageCounts } from '../models/contact.model';

const buildCounts = (overrides: Partial<StageCounts> = {}): StageCounts => ({
  prospect: 0,
  qualified: 0,
  outreached: 0,
  interested: 0,
  'to-meet': 0,
  met: 0,
  disqualified: 0,
  'not-in-campaign': 0,
  ...overrides,
});

describe('deriveActionStatus', () => {
  it('returns action_required when counts are missing', () => {
    expect(deriveActionStatus(undefined)).toBe('action_required');
  });

  it('returns waiting when no action stages are populated', () => {
    const counts = buildCounts({ prospect: 3, outreached: 2 });
    expect(deriveActionStatus(counts)).toBe('waiting');
  });

  it('returns action_required when qualified exists', () => {
    const counts = buildCounts({ qualified: 1 });
    expect(deriveActionStatus(counts)).toBe('action_required');
  });

  it('returns action_required when interested exists', () => {
    const counts = buildCounts({ interested: 2 });
    expect(deriveActionStatus(counts)).toBe('action_required');
  });

  it('returns action_required when met exists', () => {
    const counts = buildCounts({ met: 5 });
    expect(deriveActionStatus(counts)).toBe('action_required');
  });

  it('returns action_required when disqualified exists', () => {
    const counts = buildCounts({ disqualified: 1 });
    expect(deriveActionStatus(counts)).toBe('action_required');
  });
});
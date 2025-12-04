export const TOOL_DEFS = [
  {
    name: 'pick_agent',
    description: 'Choose the best agent based on user intent: onboarding vs campaign vs feedback vs setter.',
    schema: {
      type: 'object',
      properties: {
        agent: { type: 'string', enum: ['onboarding', 'campaign', 'feedback', 'setter'] },
        reason: { type: 'string' },
      },
      required: ['agent'],
    },
  },
  {
    name: 'end_conversation',
    description: 'Signal that the conversation is complete or should be closed (goodbye, task done, or onboarding finished).',
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
      },
      required: ['reason'],
    },
  },
];

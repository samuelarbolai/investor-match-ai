import { PubSub } from '@google-cloud/pubsub';
import { IntroStage } from '../models/introduction.model';

type StageEventType = 'stage.changed' | 'stage.bulk_changed';

export interface StageEventPayload {
  event: StageEventType;
  owner_id: string;
  target_ids: string[];
  previous_stage?: IntroStage;
  new_stage: IntroStage;
  changed_at: string;
  phone_number?: string;
  phone_number_id?: string;
  prospects?: Array<{ full_name: string; headline?: string }>;
  flow?: string;
}

class StageEventsService {
  private pubsub: PubSub;
  private topicName: string;

  constructor() {
    this.pubsub = new PubSub();
    this.topicName = process.env.STAGE_EVENTS_TOPIC || 'investor-match-stage-events';
  }

  async publish(payload: StageEventPayload) {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(payload));
      await this.pubsub.topic(this.topicName).publishMessage({ data: dataBuffer });
      console.info('[StageEvents] published', payload);
    } catch (error) {
      console.error('[StageEvents] failed to publish', { payload, error });
    }
  }
}

export const stageEventsService = new StageEventsService();

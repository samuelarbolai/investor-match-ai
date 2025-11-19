import { collections, Timestamp, admin } from '../config/firebase';
import { DistributionCapability } from '../models/distribution-capability.model';
import { DistributionQualityBucket } from './flattening.service';

interface CapabilityScoreEntry {
  size_score: number | null;
  engagement_score: number | null;
  quality_score: number | null;
  source_url: string | null;
  updated_at: FirebaseFirestore.Timestamp;
}

export class DistributionCapabilitySyncService {
  async syncCapabilities(
    contactId: string,
    capabilities: DistributionCapability[],
    qualityBuckets: DistributionQualityBucket[]
  ): Promise<void> {
    for (const capability of capabilities) {
      const docRef = collections.distributionCapabilities().doc(capability.id);
      const scoreEntry: CapabilityScoreEntry = {
        size_score: capability.size_score ?? null,
        engagement_score: capability.engagement_score ?? null,
        quality_score: capability.quality_score ?? null,
        source_url: capability.source_url ?? null,
        updated_at: Timestamp.now()
      };

      await docRef.set(
        {
          id: capability.id,
          distribution_type: capability.distribution_type,
          label: capability.label,
          size_score: capability.size_score ?? null,
          engagement_score: capability.engagement_score ?? null,
          quality_score: capability.quality_score ?? null,
          source_url: capability.source_url ?? null,
          contact_ids: admin.firestore.FieldValue.arrayUnion(contactId),
          updated_at: Timestamp.now(),
          [`scores.${contactId}`]: scoreEntry
        },
        { merge: true }
      );
    }

    for (const bucket of qualityBuckets) {
      const docRef = collections.distributionQualityBuckets().doc(bucket.id);
      await docRef.set(
        {
          id: bucket.id,
          distribution_type: bucket.distribution_type,
          bucket: bucket.bucket,
          label: bucket.label,
          contact_ids: admin.firestore.FieldValue.arrayUnion(contactId),
          updated_at: Timestamp.now()
        },
        { merge: true }
      );
    }
  }
}

export const distributionCapabilitySyncService = new DistributionCapabilitySyncService();

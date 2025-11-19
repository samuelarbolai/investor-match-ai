/**
 * Distribution capability node definition
 * Mirrors DistributionCapability section of DataBaseSchema_v0.1.md
 */
export interface DistributionCapability {
  /** Canonical document ID */
  id: string;

  /** Enum label e.g. SocialMedia, ContentPlatform, etc. */
  distribution_type: string;

  /** Human-readable label used in chips/UI */
  label: string;

  /** Normalized scores (0-1) */
  size_score: number | null;
  engagement_score: number | null;
  quality_score: number | null;

  /** Optional source URL */
  source_url: string | null;
}

/**
 * Distribution capability payload provided during flattening
 */
export interface DistributionCapabilityInput {
  distribution_type: string;
  label?: string;
  size_score?: number | null;
  engagement_score?: number | null;
  quality_score?: number | null;
  source_url?: string | null;
}

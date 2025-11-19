import { ensureValidDocumentId } from '../utils/document-id';
import { Contact } from '../models/contact.model';
import { Experience } from '../models/experience.model';
import { DistributionCapabilityInput, DistributionCapability } from '../models/distribution-capability.model';
import { TargetCriterionInput, TargetCriterion } from '../models/target-criterion.model';
import { CompanyInput, Company } from '../models/company.model';

type TargetField =
  | 'target_industries'
  | 'target_verticals'
  | 'target_skills'
  | 'target_roles'
  | 'target_product_types'
  | 'target_raised_capital_range_ids'
  | 'target_raised_capital_range_labels'
  | 'target_company_headcount_ranges'
  | 'target_engineering_headcount_ranges'
  | 'target_distribution_capability_ids'
  | 'target_distribution_capability_labels'
  | 'target_location_cities'
  | 'target_location_countries'
  | 'target_foundation_years'
  | 'target_mrr_ranges'
  | 'target_company_ids';

export interface FlatteningPayload {
  contact: Partial<Contact>;
  experiences?: Experience[];
  distributionCapabilities?: DistributionCapabilityInput[];
  targetCriteria?: TargetCriterionInput[];
  raisedCapitalRanges?: string[];
  companies?: CompanyInput[];
}

export interface FlatteningResult {
  contactUpdates: Partial<Contact>;
  companies: Company[];
  distributionCapabilities: DistributionCapability[];
  targetCriteria: TargetCriterion[];
  experienceCompanyIds: string[];
  distributionQualityBuckets: DistributionQualityBucket[];
}

export interface DistributionQualityBucket {
  id: string;
  distribution_type: string;
  bucket: number;
  label: string;
}

/**
 * Converts high level input payloads into normalized node documents plus flattened
 * contact fields so Firestore queries stay within 1–2 hops.
 */
export class FlatteningService {
  flatten(payload: FlatteningPayload): FlatteningResult {
    const companies = this.normalizeCompanies(payload);
    const distributionCapabilities = this.normalizeDistributionCapabilities(payload.distributionCapabilities);
    const targetCriteria = this.normalizeTargetCriteria(payload.targetCriteria);
    const experienceCompanyIds = this.collectExperienceCompanyIds(payload.experiences);
    const distributionQualityBuckets = this.buildDistributionQualityBuckets(distributionCapabilities);
    const targetFieldUpdates = this.denormalizeTargetCriteria(targetCriteria);

    const contactUpdates: Partial<Contact> = {
      raised_capital_range_ids: payload.raisedCapitalRanges || [],
      raised_capital_range_labels: this.buildRaisedCapitalLabels(payload.raisedCapitalRanges || []),
      current_company_id: payload.contact.current_company_id || companies[0]?.id || null,
      distribution_capability_ids: distributionCapabilities.map(dc => dc.id),
      distribution_capability_labels: distributionCapabilities.map(dc => dc.label),
      distribution_quality_bucket_ids: distributionQualityBuckets.map(bucket => bucket.id),
      target_criterion_ids: targetCriteria.map(tc => tc.id),
      target_criterion_summaries: targetCriteria.map(tc => tc.label),
      experience_company_ids: experienceCompanyIds,
      ...targetFieldUpdates
    };

    return {
      contactUpdates,
      companies,
      distributionCapabilities,
      targetCriteria,
      experienceCompanyIds,
      distributionQualityBuckets
    };
  }

  private normalizeCompanies(payload: FlatteningPayload): Company[] {
    const provided: CompanyInput[] = payload.companies || [];

    const inferredFromContact: CompanyInput[] = [];
    if (payload.contact.current_company) {
      inferredFromContact.push({
        name: payload.contact.current_company,
        domain: payload.contact.current_company_id ?? null,
        industries: payload.contact.industries,
        verticals: payload.contact.verticals
      });
    }

    const pastCompanies = Array.isArray(payload.contact.past_companies)
      ? payload.contact.past_companies.map(name => ({ name }))
      : [];

    const experienceCompanies = (payload.experiences || [])
      .filter(exp => Boolean(exp.company_name))
      .map(exp => ({
        name: exp.company_name!,
        domain: exp.company_id ?? null
      }));

    const combined = [
      ...provided,
      ...inferredFromContact,
      ...pastCompanies,
      ...experienceCompanies
    ];

    const seen = new Set<string>();

    return combined
      .filter(company => Boolean(company?.name))
      .map(company => {
        const id = ensureValidDocumentId(company!.name);
        if (seen.has(id)) return null;
        seen.add(id);
        return {
          id,
          name: company!.name,
          domain: company!.domain ?? null,
          description: company!.description ?? null,
          linkedin_url: company!.linkedin_url ?? null,
          crunchbase_url: company!.crunchbase_url ?? null,
          industries: company!.industries ?? [],
          verticals: company!.verticals ?? []
        };
      })
      .filter((company): company is Company => Boolean(company));
  }

  private normalizeDistributionCapabilities(inputs?: DistributionCapabilityInput[]): DistributionCapability[] {
    if (!inputs) return [];

    return inputs
      .filter(input => Boolean(input.distribution_type))
      .map(input => {
        const id = ensureValidDocumentId(`${input.distribution_type}_${input.label || 'default'}`);
        return {
          id,
          distribution_type: input.distribution_type,
          label: input.label ?? input.distribution_type,
          size_score: input.size_score ?? null,
          engagement_score: input.engagement_score ?? null,
          quality_score: input.quality_score ?? null,
          source_url: input.source_url ?? null
        };
      });
  }

  private buildDistributionQualityBuckets(capabilities: DistributionCapability[]): DistributionQualityBucket[] {
    const buckets: DistributionQualityBucket[] = [];

    for (const capability of capabilities) {
      if (typeof capability.quality_score !== 'number') {
        continue;
      }

      const normalized = Math.max(0, Math.min(1, capability.quality_score));
      const bucket = Math.max(1, Math.min(10, Math.round(normalized * 10)));
      const bucketId = ensureValidDocumentId(`${capability.distribution_type}_quality_${bucket}`);
      buckets.push({
        id: bucketId,
        distribution_type: capability.distribution_type,
        bucket,
        label: `${capability.distribution_type} quality ${bucket}`
      });
    }

    return buckets;
  }

  private normalizeTargetCriteria(inputs?: TargetCriterionInput[]): TargetCriterion[] {
    if (!inputs) return [];

    return inputs.map(input => {
      const rawLabel = input.label ?? `${input.dimension} ${input.operator} ${this.stringifyTargetValue(input.value)}`;
      return {
        id: ensureValidDocumentId(rawLabel),
        dimension: input.dimension,
        operator: input.operator,
        value: input.value,
        label: rawLabel
      };
    });
  }

  private collectExperienceCompanyIds(experiences?: Experience[]): string[] {
    if (!experiences) return [];

    const ids: string[] = [];
    for (const experience of experiences) {
      if (experience.company_id) {
        ids.push(experience.company_id);
      } else if (experience.company_name) {
        ids.push(ensureValidDocumentId(experience.company_name));
      }
    }
    return Array.from(new Set(ids));
  }

  private denormalizeTargetCriteria(criteria: TargetCriterion[]): Partial<Contact> {
    const sets: Record<TargetField, Set<string>> = {
      target_industries: new Set(),
      target_verticals: new Set(),
      target_skills: new Set(),
      target_roles: new Set(),
      target_product_types: new Set(),
      target_raised_capital_range_ids: new Set(),
      target_raised_capital_range_labels: new Set(),
      target_company_headcount_ranges: new Set(),
      target_engineering_headcount_ranges: new Set(),
      target_distribution_capability_ids: new Set(),
      target_distribution_capability_labels: new Set(),
      target_location_cities: new Set(),
      target_location_countries: new Set(),
      target_foundation_years: new Set(),
      target_mrr_ranges: new Set(),
      target_company_ids: new Set()
    };

    for (const criterion of criteria) {
      const normalizedDimension = (criterion.dimension || '').toLowerCase().replace(/[^a-z]/g, '');
      const values = this.normalizeCriterionValues(criterion.value);
      switch (normalizedDimension) {
        case 'industry':
          values.forEach(v => sets.target_industries.add(v));
          break;
        case 'vertical':
          values.forEach(v => sets.target_verticals.add(v));
          break;
        case 'skill':
          values.forEach(v => sets.target_skills.add(v));
          break;
        case 'jobrole':
          values.forEach(v => sets.target_roles.add(v));
          break;
        case 'typeofgoodproduced':
          values.forEach(v => sets.target_product_types.add(v));
          break;
        case 'raisedcapital':
          values.forEach(v => {
            sets.target_raised_capital_range_ids.add(ensureValidDocumentId(v));
            sets.target_raised_capital_range_labels.add(v);
          });
          break;
        case 'headcount':
          values.forEach(v => sets.target_company_headcount_ranges.add(v));
          break;
        case 'engineersheadcount':
          values.forEach(v => sets.target_engineering_headcount_ranges.add(v));
          break;
        case 'distributioncapability':
          values.forEach(v => {
            sets.target_distribution_capability_ids.add(ensureValidDocumentId(v));
            sets.target_distribution_capability_labels.add(v);
          });
          break;
        case 'location':
          values.forEach(v => {
            if (/^[A-Z]{2}$/.test(v)) {
              sets.target_location_countries.add(v);
            } else {
              sets.target_location_cities.add(v);
            }
          });
          break;
        case 'foundationyear':
          values.forEach(v => sets.target_foundation_years.add(v));
          break;
        case 'mrr':
          values.forEach(v => sets.target_mrr_ranges.add(v));
          break;
        case 'company':
          values.forEach(v => sets.target_company_ids.add(ensureValidDocumentId(v)));
          break;
        default:
          break;
      }
    }

    const updates: Partial<Contact> = {};
    (Object.keys(sets) as TargetField[]).forEach(field => {
      (updates as any)[field] = Array.from(sets[field]);
    });
    return updates;
  }

  private normalizeCriterionValues(value: TargetCriterionInput['value']): string[] {
    if (Array.isArray(value)) {
      return value.map(v => String(v));
    }
    return [String(value)];
  }

  private buildRaisedCapitalLabels(rangeIds: string[]): string[] {
    return rangeIds.map(id =>
      id
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
    );
  }

  private stringifyTargetValue(value: TargetCriterionInput['value']): string {
    if (Array.isArray(value)) {
      return value.join(' – ');
    }
    return String(value);
  }
}

export const flatteningService = new FlatteningService();

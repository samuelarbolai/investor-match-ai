import { flatteningService, FlatteningPayload } from './flattening.service';

describe('FlatteningService', () => {
  it('normalizes companies, distribution capabilities, and raised capital labels', () => {
    const payload: FlatteningPayload = {
      contact: {
        full_name: 'Test Founder',
        headline: 'CEO',
        contact_type: 'founder',
        current_company: 'Acme Inc',
        industries: ['fintech'],
        verticals: ['b2b']
      } as any,
      companies: [
        { name: 'Acme Inc', domain: 'acme.com' },
        { name: 'Beta Corp', domain: 'beta.com' },
        { name: 'Acme Inc', domain: 'duplicate.com' } // duplicate to ensure dedupe
      ],
      distributionCapabilities: [
        {
          distribution_type: 'newsletter',
          label: 'Weekly Updates',
          size_score: 0.9,
          engagement_score: 0.8,
          quality_score: 0.7
        }
      ],
      raisedCapitalRanges: ['seed_round'],
      experiences: [
        {
          company_name: 'Acme Inc',
          company_id: null,
          role: 'CEO',
          seniority: 'executive',
          start_date: '2020-01',
          end_date: null,
          current: true,
          description: null,
          location_city: null,
          location_country: null
        }
      ]
    };

    const result = flatteningService.flatten(payload);

    expect(result.companies).toHaveLength(2);
    expect(result.contactUpdates.current_company_id).toBe('acme_inc');
    expect(result.distributionCapabilities[0].id).toContain('newsletter');
    expect(result.contactUpdates.raised_capital_range_labels).toEqual(['Seed Round']);
    expect(result.experienceCompanyIds).toEqual(['acme_inc']);
  });

  it('denormalizes target criteria into thesis arrays and location filters', () => {
    const payload: FlatteningPayload = {
      contact: {
        full_name: 'Investor Example',
        headline: 'Partner',
        contact_type: 'investor'
      } as any,
      targetCriteria: [
        {
          dimension: 'Industry',
          operator: '=',
          value: ['Fintech', 'Climate'],
          label: 'Industries focus'
        },
        {
          dimension: 'Location',
          operator: 'in',
          value: ['San Francisco', 'US']
        },
        {
          dimension: 'RaisedCapital',
          operator: '>=',
          value: ['Series A']
        },
        {
          dimension: 'DistributionCapability',
          operator: '=',
          value: ['100k newsletter']
        }
      ]
    };

    const result = flatteningService.flatten(payload);

    expect(result.contactUpdates.target_industries).toEqual(['Fintech', 'Climate']);
    expect(result.contactUpdates.target_location_cities).toContain('San Francisco');
    expect(result.contactUpdates.target_location_countries).toContain('US');
    expect(result.contactUpdates.target_raised_capital_range_ids).toContain('series_a');
    expect(result.contactUpdates.target_distribution_capability_labels).toContain('100k newsletter');
  });
});

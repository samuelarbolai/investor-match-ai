# Founder–Investor Matching Graph Data Model & UML

This canvas contains the full data model, node definitions, edge definitions, and an embedded UML diagram description.

## 1. Collections (Nodes)
- contacts (flattened + reference IDs)
- experiences
- companies
- jobToBeDone
- skills
- industries
- verticals
- productTypes
- raisedCapitalRanges
- companyHeadcountRanges
- engineeringHeadcountRanges
- targetDomains
- roles
- distributionCapabilities
- targetCriteria

## 2. Contact Document Schema
- id
- full_name
- headline
- contact_type
- location_city
- location_country
- job_to_be_done[]
- current_company
- current_role
- past_companies[]
- roles[]
- skills[]
- seniority_levels[]
- industries[]
- verticals[]
- product_types[]
- raised_capital_range_ids[]
- raised_capital_range_labels[]  // flattened display strings
- company_headcount_ranges[]
- engineering_headcount_ranges[]
- founder_roles[]
- investor_roles[]
- target_domains[]
- stage_preferences[]
- check_size_range[]
- team_size_preferences[]
- founder_seniority_preferences[]
- engineering_headcount_preferences[]
- revenue_model_preferences[]
- risk_tolerance_preferences[]
- distribution_capability_ids[]
- distribution_capability_labels[]
- target_criterion_ids[]
- target_criterion_summaries[]
- target_industries[]
- target_verticals[]
- target_skills[]
- target_roles[]
- target_product_types[]
- target_raised_capital_range_ids[]
- target_raised_capital_range_labels[]
- target_company_headcount_ranges[]
- target_engineering_headcount_ranges[]
- target_distribution_capability_ids[]
- target_distribution_capability_labels[]
- target_location_cities[]
- target_location_countries[]
- target_foundation_years[]
- target_mrr_ranges[]
- target_company_ids[]
- experiences[] (embedded)
- experience_company_ids[]
- action_status ("action_required" | "waiting")
- linkedin_url
- email
- created_at
- updated_at

## 3. Embedded Experience Type
- company_name
- company_id (optional)
- role
- seniority
- start_date
- end_date
- current
- description
- location_city
- location_country

## 4. Attribute (Reverse Index) Document Schema
```
/{collection}/{valueId}
{
  id: string,
  label: string,
  contact_ids: string[],
  updated_at: timestamp
}
```

## 5. Edges (Explicit)
Forward edges (in Contact with flattened mirrors):
- job_to_be_done → jobToBeDone  (**_FOCUSED_ON**)
- skills → skills  (**_HAS_SKILL**)
- industries → industries  (**_IN_INDUSTRY**)
- verticals → verticals  (**_IN_VERTICAL**)
- product_types → productTypes  (**_PRODUCES**)
- raised_capital_range_ids → raisedCapitalRanges  (**_HAS_RAISED_RANGE**)
- company_headcount_ranges → companyHeadcountRanges  (**_HAS_HEADCOUNT**)
- engineering_headcount_ranges → engineeringHeadcountRanges  (**_HAS_ENGINEERING_HEADCOUNT**)
- target_domains → targetDomains  (**_TARGETS_DOMAIN**)
- roles → roles  (**_HAS_ROLE**)
- distribution_capability_ids → distributionCapabilities (**_HAS_DISTRIBUTION**)
- target_criterion_ids → targetCriteria (**_TARGETS_CRITERION**)

Location edges:
- location_city, location_country → Location (**_LOCATED_IN**)

Experience edges:
- Contact → Experience (**_HAS_EXPERIENCE**)
- Experience → Company (**_AT_COMPANY**)
- Contact → Company (flattened `current_company_id`, `past_company_ids`)
- TargetCriterion → vocab dimension (Industry, Location, RaisedCapitalRange, etc.)

Reverse edges (in Attribute docs):
- contact_ids[] list referencing contacts

## 6. UML Diagram (Text Description). UML Diagram (Text Description)
**Central Node:** Contact
- Has many attributes (skills, industries, roles, etc.)
- Has many experiences

**Attribute Nodes:** Each represents a reverse index.
- JobToBeDone
- Skill
- Industry
- Vertical
- ProductType
- RaisedCapitalRange
- CompanyHeadcountRange
- EngineeringHeadcountRange
- TargetDomain
- Role
- DistributionCapability
- TargetCriterion
- Company (for experience lookups)

**Edges:**
- Contact → JobToBeDone (0..*)
- Contact → Skill (0..*)
- Contact → Industry (0..*)
- Contact → Vertical (0..*)
- Contact → ProductType (0..*)
- Contact → RaisedCapitalRange (0..*)
- Contact → CompanyHeadcountRange (0..*)
- Contact → EngineeringHeadcountRange (0..*)
- Contact → TargetDomain (0..*)
- Contact → Role (0..*)
- Contact → Experience (1..*)
- Experience → Company (0..1)
- Contact → DistributionCapability (0..*)
- Contact → TargetCriterion (0..*)
- TargetCriterion → {Industry | Vertical | Location | RaisedCapitalRange | Headcount | EngineersHeadcount | FoundationYear | TypeOfGoodProduced | Skill | JobRole | DistributionCapability | MRR}

## 7. Firestore Implementation Blueprint

### 7.1 Collection Naming Conventions
 All Firestore collections use **lowerCamelCase**, pluralized:
- contacts
- experiences
- companies
- jobToBeDone
- skills
- industries
- verticals
- productTypes
- raisedCapitalRanges
- companyHeadcountRanges
- engineeringHeadcountRanges
- targetDomains
- roles
- distributionCapabilities
- targetCriteria

Document IDs (value IDs) must be **URL-safe strings**, ideally canonical slugs:
- Example: `software_engineering`, `raised_500k_2m`, `distribution_social_media`, `target_industry_ai`

---
### 7.2 Firestore Field Types (Strict Specification)
Below is the strict field typing required for implementation.

#### Contact Document
```
/contacts/{contactId}
- id: string
- full_name: string
- headline: string
- contact_type: string  // founder | investor | both
- location_city: string | null
- location_country: string | null

// Arrays of strings
- job_to_be_done: string[]
- past_companies: string[]
- roles: string[]
- skills: string[]
- seniority_levels: string[]
- industries: string[]
- verticals: string[]
- product_types: string[]
- raised_capital_range_ids: string[]
- raised_capital_range_labels: string[]
- company_headcount_ranges: string[]
- engineering_headcount_ranges: string[]
- founder_roles: string[]
- investor_roles: string[]
- target_domains: string[]
- stage_preferences: string[]
- check_size_range: string[]
- team_size_preferences: string[]
- founder_seniority_preferences: string[]
- engineering_headcount_preferences: string[]
- revenue_model_preferences: string[]
- risk_tolerance_preferences: string[]
- distribution_capability_ids: string[]
- distribution_capability_labels: string[]
- target_criterion_ids: string[]
- target_criterion_summaries: string[]

current_company: string | null
current_company_id: string | null
current_role: string | null

// Embedded objects array
experiences: Experience[]
experience_company_ids: string[]

linkedin_url: string | null
email: string | null
created_at: timestamp
updated_at: timestamp

### 7.3 Flattening Rules
- Maintain flattened labels/arrays on `contacts` for every normalized node reference (companies, raisedCapitalRanges, distributionCapabilities, targetCriteria, etc.) so query patterns stay ≤2 hops.
- Write pipeline: normalize input → upsert normalized node document (if missing) → capture node IDs + human labels on the contact document → invoke reverse-index synchronization. This keeps Firestore read costs on par with today while enabling richer graph traversal when needed.
```

#### Experience Object
```
{
  company_name: string,
  company_id: string | null,
  role: string,
  seniority: string,
  start_date: string,      // YYYY-MM
  end_date: string | null, // YYYY-MM or null
  current: boolean,
  description: string | null,
  location_city: string | null,
  location_country: string | null
}
```

---
### 7.3 Attribute (Reverse Index) Document Type
Applies to all collections: skills, industries, verticals, etc.
```
/{collection}/{valueId}
{
  id: string,
  label: string,
  contact_ids: string[],
  updated_at: timestamp
}
```

Rules:
- `contact_ids` **must always be an array**, never null.
- `contact_ids` must contain **unique** contact IDs.
- Missing attribute docs must be **created on demand** when a Contact references a value.

---
### 7.4 Reverse Index Mapping Table
This table defines the exact Firestore collections each contact field maps to.

| Contact Field | Attribute Collection | Edge Name |
|---------------|---------------------|-----------|
| job_to_be_done[] | jobToBeDone | _FOCUSED_ON |
| skills[] | skills | _HAS_SKILL |
| industries[] | industries | _IN_INDUSTRY |
| verticals[] | verticals | _IN_VERTICAL |
| product_types[] | productTypes | _PRODUCES |
| funding_stages[] | fundingStages | _HAS_RAISED |
| company_headcount_ranges[] | companyHeadcountRanges | _HAS_HEADCOUNT |
| engineering_headcount_ranges[] | engineeringHeadcountRanges | _HAS_ENGINEERING_HEADCOUNT |
| target_domains[] | targetDomains | _TARGETS_DOMAIN |
| roles[] | roles | _HAS_ROLE |

These mappings are required for the matching algorithm and all write operations.

---
### 7.5 Required Write Rules
When a Contact is created or updated:

#### 1. Forward edges must be written into the Contact doc.
- Update scalar values as provided
- Replace arrays atomically

#### 2. Reverse indexes must be synchronized.
For every attribute array field:
- Add the Contact ID to the corresponding `{valueId}.contact_ids` docs.
- Remove the Contact ID from attribute docs that no longer apply.

#### 3. Missing attribute docs must be created automatically.
```
if /skills/python does not exist:
   create { id: "python", label: "Python", contact_ids: [] }
```

#### 4. Timestamps must be updated appropriately.
- Contact: `updated_at`
- Attribute docs touched: `updated_at`

---
### 7.6 Required Read Rules
- Contact fetches are direct
- Matching fetches are based exclusively on reverse index documents
- Experiences are always read *embedded*
- Company lookup is optional

---
### 7.7 Schema Enforcement Notes
Firestore has no schema enforcement, so the API must enforce:
- Required fields must be present
- Arrays must always exist, never `null`
- All attribute IDs must be normalized slugs
- `contact_ids` arrays must not exceed Firestore's 10MB doc limit

If an attribute grows too large, it must be **sharded** (future section).

---
## 8. Notes
This canvas is now expanded with the Firestore Implementation Blueprint and ready for API implementation.
This canvas is now ready for expansion, editing, or adding the API design section.

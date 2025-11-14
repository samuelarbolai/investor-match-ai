# InvestorMatch Schema Outline (from `investormatch_schema_v9_expanded_tbd.html`)

## Core Entities
- **Contact**
  - `name : string`
  - `email : string (unique)`
  - `summary : string`
- **Experience**
  - `start_date : date`
  - `end_date : date?`
  - `is_current : boolean`
  - `description : string?`
- **Company**
  - `name : string`
  - `domain : string (unique)`
  - `description : string?`

## Vocabs / Facets
- **JobRole**
  - `name : string`
  - ⚠️ TBD optional controlled list.
- **Skill**
  - `name : string`
  - ⚠️ TBD optional controlled list.
- **Industry**
  - `name : string`
  - ⚠️ TBD industry taxonomy not finalized.
- **Vertical**
  - `name : string`
  - ⚠️ TBD vertical list not finalized.
- **RaisedCapital**
  - `range : string` (examples: "<500K USD", "500K–2M USD", "2–5M USD", ">5M USD").
- **Headcount**
  - `range : string` (examples: "<10", "10–50", ">50").
- **EngineersHeadcount**
  - `ratio_range : string` (examples: "<30%", "30–60%", ">60%").
- **FoundationYear**
  - `range : string` (examples: "2018–2020", "2021–2023").
- **Location**
  - `name : string` (freeform or ISO/city,country).
- **TypeOfGoodProduced**
  - `name : enum` (Software | Hardware | Non-tech | Capital Management).

## Intent & Thesis
- **JobToBeDone**
  - `name : enum` (Raise Capital | Invest Capital | Find Lead Investor | Hire CTO | Recruit Engineers).
- **TargetCriterion**
  - `dimension : string` (e.g., "Industry", "Location", "RaisedCapital", "Vertical", "TypeOfGoodProduced", "Headcount", "EngineersHeadcount", "FoundationYear", "Skill", "JobRole").
  - `operator : string` ("=", "in", ">=", "<=", "between").
  - `weight : float?` (optional scoring weight; ⚠️ TBD scale).

## Intro Pipeline
- **IntroStage**
  - `stage : enum` (prospected | outreached | meeting_set | met | closed | disqualified).
  - `disqualification_reason : string?`
  - `created_at : date`
  - `updated_at : date?`
  - `notes : string?`
  - `conversion_score : float?`
  - `campaign_id : string?`

## Relationships
- `Contact --(HAS_EXPERIENCE)--> Experience`
- `Experience --(AT)--> Company`
- `Experience --(HAS_ROLE)--> JobRole`
- `Experience --(HAS_SKILL)--> Skill`
- `Contact --(IS_LOCATED_AT)--> Location`
- `Company --(LOCATED_IN)--> Location`
- `Company --(IN_INDUSTRY)--> Industry`
- `Company --(IN_VERTICAL)--> Vertical`
- `Vertical --(IS_IN)--> Industry`
- `Company --(HAS_RAISED)--> RaisedCapital`
- `Company --(HAS_HEADCOUNT)--> Headcount`
- `Company --(HAS_ENGINEERS_HEADCOUNT)--> EngineersHeadcount`
- `Company --(FOUNDED_IN)--> FoundationYear`
- `Company --(PRODUCES)--> TypeOfGoodProduced`
- `Contact --(FOCUSED_ON)--> JobToBeDone`
- `Contact --(TARGETS)--> TargetCriterion`
- `TargetCriterion --(FILTERS_ON)--> Industry`
- `TargetCriterion --(FILTERS_ON)--> Vertical`
- `TargetCriterion --(FILTERS_ON)--> Location`
- `TargetCriterion --(FILTERS_ON)--> RaisedCapital`
- `TargetCriterion --(FILTERS_ON)--> Headcount`
- `TargetCriterion --(FILTERS_ON)--> EngineersHeadcount`
- `TargetCriterion --(FILTERS_ON)--> FoundationYear`
- `TargetCriterion --(FILTERS_ON)--> TypeOfGoodProduced`
- `TargetCriterion --(FILTERS_ON)--> Skill`
- `TargetCriterion --(FILTERS_ON)--> JobRole`
- `Contact --(IS_IN_STAGE)--> IntroStage`
- `IntroStage --(FOR_CONTACT)--> Contact`

/**
 * Target criterion dimensions come directly from DataBaseSchema_v0.1.md
 */
export type TargetCriterionDimension =
  | 'Industry'
  | 'Location'
  | 'RaisedCapital'
  | 'Vertical'
  | 'TypeOfGoodProduced'
  | 'Headcount'
  | 'EngineersHeadcount'
  | 'FoundationYear'
  | 'Skill'
  | 'JobRole'
  | 'DistributionCapability'
  | 'MRR';

export type TargetCriterionOperator = '=' | 'in' | '>=' | '<=' | 'between';

export interface TargetCriterion {
  /** Canonical document ID */
  id: string;
  dimension: TargetCriterionDimension;
  operator: TargetCriterionOperator;
  value: string | number | string[] | [number, number];
  /** Friendly label rendered in UI */
  label: string;
}

export interface TargetCriterionInput {
  dimension: TargetCriterionDimension;
  operator: TargetCriterionOperator;
  value: string | number | string[] | [number, number];
  label?: string;
}

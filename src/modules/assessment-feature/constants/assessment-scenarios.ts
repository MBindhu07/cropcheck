import type {
  AssessmentScenario,
  DefectBreakdown,
  QualityGrade,
} from '../types/assessment';

type ScenarioOption = {
  value: AssessmentScenario;
  label: string;
};

export const ASSESSMENT_SCENARIOS: ScenarioOption[] = [
  { value: 'good', label: 'Good quality' },
  { value: 'average', label: 'Average quality' },
  { value: 'poor', label: 'Poor quality' },
  { value: 'failure', label: 'Service failure' },
];

type ScenarioResult = {
  grade: QualityGrade;
  defectPercentage: number;
  breakdown: DefectBreakdown;
  summary: string;
};

// Breakdown values add up to defectPercentage.
export const SCENARIO_RESULTS: Record<Exclude<AssessmentScenario, 'failure'>, ScenarioResult> = {
  good: {
    grade: 'A',
    defectPercentage: 5,
    breakdown: { bruising: 2, discolouration: 1, sizeVariation: 2 },
    summary: 'Uniform size and colour with very few surface marks. Suitable for premium buyers.',
  },
  average: {
    grade: 'B',
    defectPercentage: 15,
    breakdown: { bruising: 6, discolouration: 4, sizeVariation: 5 },
    summary: 'Mostly consistent produce with some bruising and size variation. Fit for regular markets.',
  },
  poor: {
    grade: 'C',
    defectPercentage: 30,
    breakdown: { bruising: 13, discolouration: 10, sizeVariation: 7 },
    summary: 'Noticeable damage and uneven ripeness across the batch. Best sold for processing.',
  },
};

export const DEFECT_LABELS: Record<keyof DefectBreakdown, string> = {
  bruising: 'Bruising',
  discolouration: 'Discolouration',
  sizeVariation: 'Size variation',
};

export const GRADE_LABELS: Record<QualityGrade, string> = {
  A: 'Premium',
  B: 'Standard',
  C: 'Processing',
};

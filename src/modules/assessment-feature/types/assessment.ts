import type { CropType } from '@/constants/crops';

export type QualityGrade = 'A' | 'B' | 'C';

export type AssessmentScenario = 'good' | 'average' | 'poor' | 'failure';

export type DefectBreakdown = {
  bruising: number;
  discolouration: number;
  sizeVariation: number;
};

export type CropAssessment = {
  grade: QualityGrade;
  defectPercentage: number;
  // Listings saved before the breakdown existed don't have it.
  breakdown?: DefectBreakdown;
  summary: string;
  assessedAt: string;
  isSimulated: true;
};

export type AssessCropRequest = {
  photoUri: string;
  crop?: CropType;
  scenario: AssessmentScenario;
};

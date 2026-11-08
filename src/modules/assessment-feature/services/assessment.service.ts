import { delay } from '@/lib/delay';

import { SCENARIO_RESULTS } from '../constants/assessment-scenarios';
import type { AssessCropRequest, CropAssessment } from '../types/assessment';

const SIMULATED_LATENCY_MS = 2000;

export class AssessmentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssessmentServiceError';
  }
}

// Mock: the grade comes from the chosen demo scenario, not from the photo.
// A real implementation would upload request.photoUri and map the response.
export async function assessCropQuality(request: AssessCropRequest): Promise<CropAssessment> {
  await delay(SIMULATED_LATENCY_MS);

  if (request.scenario === 'failure') {
    throw new AssessmentServiceError(
      'The assessment service is not responding right now. Your details are saved, so you can try again.',
    );
  }

  const result = SCENARIO_RESULTS[request.scenario];

  return {
    ...result,
    breakdown: { ...result.breakdown },
    assessedAt: new Date().toISOString(),
    isSimulated: true,
  };
}

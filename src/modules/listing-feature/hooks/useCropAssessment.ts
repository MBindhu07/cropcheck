import { useCallback, useRef, useState } from 'react';

import { haptics } from '@/lib/haptics';
import {
  AssessmentServiceError,
  assessCropQuality,
} from '@/modules/assessment-feature/services/assessment.service';

import { useProduceDraftStore } from '../store/use-produce-draft-store';

type AssessmentFailure = { message: string; photoUri: string };

export function useCropAssessment() {
  const currentPhotoUri = useProduceDraftStore((state) => state.photoUri);
  const [isAssessing, setIsAssessing] = useState(false);
  const [failure, setFailure] = useState<AssessmentFailure | null>(null);
  const inFlight = useRef(false);

  const assess = useCallback(async () => {
    if (inFlight.current) return;

    const { photoUri, crop, scenario, setAssessment } = useProduceDraftStore.getState();
    if (!photoUri) return;

    inFlight.current = true;
    setIsAssessing(true);
    setFailure(null);
    try {
      const result = await assessCropQuality({ photoUri, crop: crop ?? undefined, scenario });
      setAssessment({ result, photoUri });
      haptics.success();
    } catch (err) {
      haptics.error();
      setFailure({
        photoUri,
        message:
          err instanceof AssessmentServiceError
            ? err.message
            : 'The assessment could not be completed. Try again.',
      });
    } finally {
      inFlight.current = false;
      setIsAssessing(false);
    }
  }, []);

  const error = failure && failure.photoUri === currentPhotoUri ? failure.message : null;

  return { assess, isAssessing, error };
}

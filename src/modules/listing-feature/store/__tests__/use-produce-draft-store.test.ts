import type { CropAssessment } from '@/modules/assessment-feature/types/assessment';

import { selectCurrentAssessment, useProduceDraftStore } from '../use-produce-draft-store';

const result: CropAssessment = {
  grade: 'A',
  defectPercentage: 5,
  summary: 'Looks good',
  assessedAt: '2026-01-01T00:00:00.000Z',
  isSimulated: true,
};

const draft = () => useProduceDraftStore.getState();

describe('produce draft store', () => {
  beforeEach(() => draft().reset());

  it('keeps the assessment while the photo stays the same', () => {
    draft().setPhoto('file:///a.jpg');
    draft().setAssessment({ result, photoUri: 'file:///a.jpg' });
    draft().setPhoto('file:///a.jpg');

    expect(selectCurrentAssessment(draft())).toEqual(result);
  });

  it('drops the assessment when the photo changes', () => {
    draft().setPhoto('file:///a.jpg');
    draft().setAssessment({ result, photoUri: 'file:///a.jpg' });
    draft().setPhoto('file:///b.jpg');

    expect(selectCurrentAssessment(draft())).toBeNull();
  });

  it('ignores a late result for a photo that was already replaced', () => {
    draft().setPhoto('file:///b.jpg');
    draft().setAssessment({ result, photoUri: 'file:///a.jpg' });

    expect(draft().assessment).toBeNull();
  });

  it('keeps typed details when the photo changes', () => {
    draft().setField('quantity', '120');
    draft().setPhoto('file:///a.jpg');
    draft().setPhoto('file:///b.jpg');

    expect(draft().quantity).toBe('120');
  });
});

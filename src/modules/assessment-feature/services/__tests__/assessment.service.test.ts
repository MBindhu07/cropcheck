import { AssessmentServiceError, assessCropQuality } from '../assessment.service';

describe('assessCropQuality', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  async function run(scenario: 'good' | 'average' | 'poor' | 'failure') {
    const promise = assessCropQuality({ photoUri: 'file:///photo.jpg', scenario });
    jest.advanceTimersByTime(2000);
    return promise;
  }

  it.each([
    ['good', 'A', 5],
    ['average', 'B', 15],
    ['poor', 'C', 30],
  ] as const)('maps the %s scenario to grade %s with %i%% defects', async (scenario, grade, defects) => {
    const result = await run(scenario);

    expect(result.grade).toBe(grade);
    expect(result.defectPercentage).toBe(defects);
    expect(result.isSimulated).toBe(true);
  });

  it('keeps the breakdown consistent with the total', async () => {
    const result = await run('average');
    const { bruising, discolouration, sizeVariation } = result.breakdown!;

    expect(bruising + discolouration + sizeVariation).toBe(result.defectPercentage);
  });

  it('rejects with a readable error for the failure scenario', async () => {
    await expect(run('failure')).rejects.toBeInstanceOf(AssessmentServiceError);
  });

  it('waits before answering', async () => {
    const onDone = jest.fn();
    assessCropQuality({ photoUri: 'file:///photo.jpg', scenario: 'good' }).then(onDone);

    jest.advanceTimersByTime(1500);
    await Promise.resolve();
    expect(onDone).not.toHaveBeenCalled();
  });
});

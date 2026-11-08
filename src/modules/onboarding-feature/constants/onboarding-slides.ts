export type OnboardingSlide = {
  key: 'upload' | 'assess' | 'publish';
  title: string;
  body: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    key: 'upload',
    title: 'Upload a photo of your crop',
    body: 'Pick a clear picture of your harvest from the gallery. One photo is all a buyer needs to get started.',
  },
  {
    key: 'assess',
    title: 'Get a quality assessment',
    body: 'CropCheck grades the batch and estimates the share of defects, so you can price it with confidence.',
  },
  {
    key: 'publish',
    title: 'Publish your produce listing',
    body: 'Add quantity, price and location, then publish. Mark it as sold once the deal is done.',
  },
];

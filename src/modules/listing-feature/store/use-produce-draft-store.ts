import { create } from 'zustand';

import type { CropType } from '@/constants/crops';
import type {
  AssessmentScenario,
  CropAssessment,
} from '@/modules/assessment-feature/types/assessment';

type DraftAssessment = {
  result: CropAssessment;
  photoUri: string;
};

type ProduceDraftState = {
  crop: CropType | null;
  quantity: string;
  price: string;
  location: string;
  photoUri: string | null;
  scenario: AssessmentScenario;
  assessment: DraftAssessment | null;
  setField: (field: 'quantity' | 'price' | 'location', value: string) => void;
  setCrop: (crop: CropType) => void;
  setPhoto: (uri: string) => void;
  setScenario: (scenario: AssessmentScenario) => void;
  setAssessment: (assessment: DraftAssessment) => void;
  reset: () => void;
};

const initialDraft = {
  crop: null,
  quantity: '',
  price: '',
  location: '',
  photoUri: null,
  scenario: 'good' as AssessmentScenario,
  assessment: null,
};

export const useProduceDraftStore = create<ProduceDraftState>()((set) => ({
  ...initialDraft,
  setField: (field, value) => set({ [field]: value }),
  setCrop: (crop) => set({ crop }),
  setPhoto: (uri) =>
    set((state) => ({
      photoUri: uri,
      assessment: state.assessment?.photoUri === uri ? state.assessment : null,
    })),
  setScenario: (scenario) => set({ scenario }),
  setAssessment: (assessment) =>
    set((state) => (state.photoUri === assessment.photoUri ? { assessment } : {})),
  reset: () => set(initialDraft),
}));

export function selectCurrentAssessment(state: ProduceDraftState) {
  if (!state.assessment || state.assessment.photoUri !== state.photoUri) return null;
  return state.assessment.result;
}

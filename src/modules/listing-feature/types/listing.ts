import type { CropType } from '@/constants/crops';
import type { CropAssessment, QualityGrade } from '@/modules/assessment-feature/types/assessment';

export type ListingStatus = 'available' | 'sold';

export type Listing = {
  id: string;
  crop: CropType;
  quantityKg: number;
  pricePerKg: number;
  location: string;
  photoPath: string;
  assessment: CropAssessment;
  status: ListingStatus;
  createdAt: string;
  soldAt?: string;
};

export type CropFilter = CropType | 'all';
export type GradeFilter = QualityGrade | 'all';

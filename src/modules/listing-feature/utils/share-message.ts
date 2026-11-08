import { CROP_LABELS } from '@/constants/crops';
import { formatCurrency, formatQuantity } from '@/lib/format';
import { GRADE_LABELS } from '@/modules/assessment-feature/constants/assessment-scenarios';

import type { Listing } from '../types/listing';

// Plain text with WhatsApp-style *bold*, since that's where most farmers
// share. Other apps just show the asterisks.
export function buildShareMessage(listing: Listing) {
  const { grade } = listing.assessment;
  return [
    `*${CROP_LABELS[listing.crop]} for sale*`,
    `Grade ${grade} (${GRADE_LABELS[grade]})`,
    `Quantity: ${formatQuantity(listing.quantityKg)}`,
    `Price: ${formatCurrency(listing.pricePerKg)}/kg`,
    `Location: ${listing.location}`,
    '',
    'Listed on CropCheck',
  ].join('\n');
}

export const CROP_TYPES = ['tomato', 'potato', 'onion'] as const;

export type CropType = (typeof CROP_TYPES)[number];

export const CROP_LABELS: Record<CropType, string> = {
  tomato: 'Tomato',
  potato: 'Potato',
  onion: 'Onion',
};

export const CROP_SWATCHES: Record<CropType, { bg: string; fg: string }> = {
  tomato: { bg: '#F6E0DA', fg: '#9C3B26' },
  potato: { bg: '#F1E7D3', fg: '#7C5B22' },
  onion: { bg: '#EFE0EA', fg: '#7A3D62' },
};

export const CROP_IMAGES: Record<CropType, number> = {
  tomato: require('../../assets/crops/tomato.png'),
  potato: require('../../assets/crops/potato.png'),
  onion: require('../../assets/crops/onion.png'),
};

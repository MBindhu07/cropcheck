import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type ImageStyle } from 'react-native';

import { CROP_IMAGES, CROP_SWATCHES, type CropType } from '@/constants/crops';
import { resolvePhotoUri } from '@/lib/photo-storage';

type ListingPhotoProps = {
  photoPath: string;
  crop: CropType;
  style: ImageStyle;
  dimmed?: boolean;
};

export function ListingPhoto({ photoPath, crop, style, dimmed = false }: ListingPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View
        style={[style, styles.fallback, { backgroundColor: CROP_SWATCHES[crop].bg }, dimmed && styles.dimmed]}
      >
        <Image source={CROP_IMAGES[crop]} style={styles.fallbackImage} contentFit="contain" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolvePhotoUri(photoPath) }}
      style={[style, dimmed && styles.dimmed]}
      contentFit="cover"
      transition={150}
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackImage: {
    width: '60%',
    height: '60%',
  },
  dimmed: {
    opacity: 0.55,
  },
});

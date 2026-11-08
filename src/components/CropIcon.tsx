import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CROP_IMAGES, CROP_SWATCHES, type CropType } from '@/constants/crops';

type CropIconProps = {
  crop: CropType;
  size?: number;
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function CropIcon({ crop, size = 40, framed = true, style }: CropIconProps) {
  const imageSize = framed ? size * 0.74 : size;

  return (
    <View
      style={[
        styles.frame,
        { width: size, height: size, borderRadius: size / 2 },
        framed && { backgroundColor: CROP_SWATCHES[crop].bg },
        style,
      ]}
    >
      <Image
        source={CROP_IMAGES[crop]}
        style={{ width: imageSize, height: imageSize }}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

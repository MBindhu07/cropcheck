import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Notice } from '@/components/ui/Notice';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

type PhotoPickerProps = {
  photoUri: string | null;
  onPick: () => void;
  isPicking: boolean;
  permissionIssue: { canAskAgain: boolean } | null;
  hasError?: boolean;
};

export function PhotoPicker({
  photoUri,
  onPick,
  isPicking,
  permissionIssue,
  hasError = false,
}: PhotoPickerProps) {
  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewWrap}>
          <Image
            source={{ uri: photoUri }}
            style={styles.preview}
            contentFit="cover"
            transition={150}
            accessibilityLabel="Selected produce photo"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            onPress={onPick}
            disabled={isPicking}
            style={({ pressed }) => [styles.changeButton, pressed && styles.changeButtonPressed]}
          >
            <Feather name="refresh-cw" size={14} color={colors.ink} />
            <AppText variant="caption" style={styles.changeLabel}>
              Change photo
            </AppText>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a photo from your gallery"
          onPress={onPick}
          disabled={isPicking}
          style={({ pressed }) => [
            styles.dropzone,
            hasError && styles.dropzoneError,
            pressed && styles.dropzonePressed,
          ]}
        >
          <View style={styles.dropIcon}>
            <Feather name="image" size={22} color={colors.primary} />
          </View>
          <AppText variant="bodyStrong">Add a photo from your gallery</AppText>
          <AppText variant="caption" tone="subtle">
            A clear, well-lit shot of the batch works best
          </AppText>
        </Pressable>
      )}

      {permissionIssue ? (
        <Notice
          tone="danger"
          icon="lock"
          title="Photo access is turned off"
          message={
            permissionIssue.canAskAgain
              ? 'CropCheck needs access to your photos to attach a picture. Allow access when prompted.'
              : 'Photo access was denied. Turn it on for CropCheck in your device settings, then come back.'
          }
          action={
            <AppButton
              label={permissionIssue.canAskAgain ? 'Try again' : 'Open settings'}
              variant="secondary"
              onPress={permissionIssue.canAskAgain ? onPick : () => Linking.openSettings()}
              style={styles.noticeButton}
            />
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  previewWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  changeButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  changeButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  changeLabel: {
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  dropzone: {
    aspectRatio: 16 / 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  dropzoneError: {
    borderColor: colors.danger,
  },
  dropzonePressed: {
    backgroundColor: colors.surfaceMuted,
  },
  dropIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  noticeButton: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/BrandMark';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { Notice } from '@/components/ui/Notice';
import { Screen } from '@/components/ui/Screen';
import { colors, fonts, spacing } from '@/theme/tokens';

import { phoneSchema } from '../schema/auth.schema';
import { DEMO_OTP, requestOtp } from '../services/auth.service';

export function PhoneSignInPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    setSubmitting(true);
    try {
      await requestOtp(parsed.data);
      router.push({ pathname: '/auth/verify', params: { phone: parsed.data } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      header={
        <View style={styles.brand}>
          <BrandMark />
        </View>
      }
      footer={
        <AppButton
          label="Send code"
          onPress={handleContinue}
          loading={submitting}
          disabled={phone.length === 0}
        />
      }
    >
      <View style={styles.intro}>
        <AppText variant="display">Sign in with your mobile number</AppText>
        <AppText variant="body" tone="muted">
          We use your number to keep your listings tied to you on this device.
        </AppText>
      </View>

      <AppTextInput
        label="Mobile number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text.replace(/\D/g, '').slice(0, 10));
          if (error) setError(undefined);
        }}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={10}
        placeholder="98765 43210"
        returnKeyType="done"
        onSubmitEditing={handleContinue}
        error={error}
        autoFocus
        prefix={
          <View style={styles.prefix}>
            <AppText style={styles.prefixText}>+91</AppText>
          </View>
        }
      />

      <View style={styles.notice}>
        <Notice
          title="Demo sign-in"
          message={`No SMS is sent. Enter any 10-digit number, then use code ${DEMO_OTP} on the next screen.`}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  intro: {
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  prefix: {
    paddingRight: spacing.md,
    marginRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  prefixText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.inkMuted,
  },
  notice: {
    marginTop: spacing.xxl,
  },
});

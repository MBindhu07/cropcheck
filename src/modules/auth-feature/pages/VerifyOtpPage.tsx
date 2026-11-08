import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Notice } from '@/components/ui/Notice';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { formatPhone } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { useSessionStore } from '@/store/use-session-store';
import { spacing } from '@/theme/tokens';

import { OtpInput } from '../components/OtpInput';
import { otpSchema } from '../schema/auth.schema';
import { AuthServiceError, DEMO_OTP, verifyOtp } from '../services/auth.service';

export function VerifyOtpPage() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const signIn = useSessionStore((state) => state.signIn);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const inFlight = useRef(false);

  const handleVerify = async (value = code) => {
    if (inFlight.current) return;

    const parsed = otpSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    inFlight.current = true;
    setVerifying(true);
    setError(undefined);
    try {
      const session = await verifyOtp(phone, parsed.data);
      haptics.success();
      signIn(session);
    } catch (err) {
      haptics.error();
      setError(err instanceof AuthServiceError ? err.message : 'Something went wrong. Try again.');
      setCode('');
    } finally {
      inFlight.current = false;
      setVerifying(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <AppButton
          label="Verify and continue"
          onPress={() => handleVerify()}
          loading={verifying}
          disabled={code.length < 6}
        />
      }
    >
      <View style={styles.intro}>
        <AppText variant="display">Enter the code</AppText>
        <AppText variant="body" tone="muted">
          We sent a 6-digit code to{' '}
          <AppText variant="bodyStrong">{phone ? formatPhone(phone) : 'your number'}</AppText>.{' '}
          <AppText variant="bodyStrong" tone="primary" onPress={() => router.back()}>
            Change number
          </AppText>
        </AppText>
      </View>

      <OtpInput
        value={code}
        onChange={(value) => {
          setCode(value);
          if (error) setError(undefined);
        }}
        onComplete={handleVerify}
        hasError={Boolean(error)}
      />

      {error ? (
        <AppText variant="caption" tone="danger" style={styles.error} accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}

      <View style={styles.notice}>
        <Notice title="Demo code" message={`Use ${DEMO_OTP}. Any other code is rejected so you can see the error state.`} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  error: {
    marginTop: spacing.md,
  },
  notice: {
    marginTop: spacing.xxl,
  },
});

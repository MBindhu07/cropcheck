import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CropIcon } from '@/components/CropIcon';
import { EmptyState } from '@/components/EmptyState';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { confirmAction } from '@/lib/confirm';
import { formatPhone } from '@/lib/format';
import { useSessionStore } from '@/store/use-session-store';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

import { ListingCard } from '../components/ListingCard';
import { ListingFilters } from '../components/ListingFilters';
import { ListingSummary } from '../components/ListingSummary';
import { useFilteredListings } from '../hooks/useFilteredListings';
import { useProduceDraftStore } from '../store/use-produce-draft-store';
import type { CropFilter, GradeFilter } from '../types/listing';

export function HomePage() {
  const insets = useSafeAreaInsets();
  const session = useSessionStore((state) => state.session);
  const signOut = useSessionStore((state) => state.signOut);
  const resetDraft = useProduceDraftStore((state) => state.reset);
  const [cropFilter, setCropFilter] = useState<CropFilter>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const { all, filtered, totals } = useFilteredListings(cropFilter, gradeFilter);

  const hasListings = all.length > 0;
  const filtersActive = cropFilter !== 'all' || gradeFilter !== 'all';

  const startNewListing = () => {
    resetDraft();
    router.push('/produce/new');
  };

  const clearFilters = () => {
    setCropFilter('all');
    setGradeFilter('all');
  };

  const handleSignOut = async () => {
    const confirmed = await confirmAction({
      title: 'Sign out?',
      message: 'Your listings stay saved on this device.',
      confirmLabel: 'Sign out',
      destructive: true,
    });
    if (confirmed) signOut();
  };

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <AppText variant="caption" tone="muted">
            {session ? formatPhone(session.phone) : 'Signed in'} · Demo account
          </AppText>
          <AppText variant="display">Your produce</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={handleSignOut}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Feather name="log-out" size={18} color={colors.ink} />
        </Pressable>
      </View>

      {hasListings ? (
        <>
          <ListingSummary {...totals} />
          <ListingFilters
            crop={cropFilter}
            grade={gradeFilter}
            onCropChange={setCropFilter}
            onGradeChange={setGradeFilter}
          />
          <View style={styles.resultsRow}>
            <AppText variant="overline" tone="subtle">
              {filtersActive
                ? `${filtered.length} of ${all.length} listings`
                : `${all.length} ${all.length === 1 ? 'listing' : 'listings'}`}
            </AppText>
            {filtersActive ? (
              <AppText variant="caption" tone="primary" onPress={clearFilters} style={styles.clear}>
                Clear filters
              </AppText>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push({ pathname: '/listing/[id]', params: { id: item.id } })}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          hasListings ? (
            <EmptyState
              icon="filter"
              title="No listings match"
              message="Try a different crop or grade, or clear the filters to see everything."
              action={<AppButton label="Clear filters" variant="secondary" onPress={clearFilters} />}
            />
          ) : (
            <EmptyState
              art={
                <View style={styles.emptyArt}>
                  <CropIcon crop="onion" size={56} style={styles.emptyArtSide} />
                  <CropIcon crop="tomato" size={76} style={styles.emptyArtCenter} />
                  <CropIcon crop="potato" size={56} style={styles.emptyArtSide} />
                </View>
              }
              title="No produce listed yet"
              message="Add a photo of your harvest, get a quality grade and publish your first listing in a minute."
              action={<AppButton label="Add your first listing" icon="plus" onPress={startNewListing} />}
            />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 104 }]}
        showsVerticalScrollIndicator={false}
      />

      {hasListings ? (
        <View style={[styles.fabWrap, { bottom: insets.bottom + spacing.lg }]}>
          <AppButton label="Add produce" icon="plus" onPress={startNewListing} style={styles.fab} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
  },
  headerBlock: {
    gap: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    gap: spacing.xs,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  clear: {
    fontFamily: fonts.bold,
  },
  separator: {
    height: spacing.md,
  },
  emptyArt: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  emptyArtSide: {
    marginBottom: spacing.xs,
  },
  emptyArtCenter: {
    marginHorizontal: -spacing.sm,
    zIndex: 1,
    borderWidth: 4,
    borderColor: colors.background,
  },
  fabWrap: {
    position: 'absolute',
    right: spacing.xl,
  },
  fab: {
    borderRadius: radius.pill,
    shadowColor: '#1A2B1F',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});

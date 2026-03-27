// src/components/MyPathwayCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';
import { SOCIAL_PROOF } from '../data/pathwayData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MyPathwayCardProps {
  onSwitchPress?: () => void;
}

export default function MyPathwayCard({ onSwitchPress }: MyPathwayCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const { activePathway, activeProgress, ownedPathways } = usePathway();

  if (!activePathway || !activeProgress) return null;

  const currentPhase = activePathway.phases.find(p => p.id === activeProgress.currentPhaseId);
  const completedInPhase = currentPhase
    ? currentPhase.programs.filter(p => activeProgress.completedPrograms.includes(p.questId)).length
    : 0;
  const totalInPhase = currentPhase?.programs.length ?? 0;
  const phaseProgress = totalInPhase > 0 ? completedInPhase / totalInPhase : 0;
  const currentProgram = currentPhase?.programs.find(p => p.questId === activeProgress.currentProgramId);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PathwayDetail' as any, { pathwayId: activePathway.id })}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: activePathway.accentColor + '33' }]}>
            <Text style={styles.iconText}>{activePathway.icon}</Text>
          </View>
          <View>
            <Text style={styles.label}>MY PATHWAY</Text>
            <Text style={styles.pathwayName}>{activePathway.name}</Text>
          </View>
        </View>
        {ownedPathways.length > 1 && (
          <TouchableOpacity onPress={onSwitchPress} style={styles.switchBtn}>
            <Text style={styles.switchText}>Switch</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Hero lesson block */}
      <View style={styles.heroBlock}>
        <Image
          source={{ uri: currentProgram?.image ?? '' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.durationBadge}>{Math.round(activeProgress.currentProgramLessonCount * 0.75)} min</Text>
          <Text style={styles.upNext}>UP NEXT</Text>
          <Text style={styles.lessonTitle} numberOfLines={1}>{activeProgress.currentLessonTitle}</Text>
          <Text style={styles.lessonMeta}>
            {activeProgress.currentProgramTitle} · Lesson {activeProgress.currentLessonNumber} of {activeProgress.currentProgramLessonCount}
          </Text>
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8}>
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Program covers */}
      {currentPhase && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coversRow}
        >
          {currentPhase.programs.map(program => {
            const isCompleted = activeProgress.completedPrograms.includes(program.questId);
            const isCurrent = program.questId === activeProgress.currentProgramId;
            const imgSrc = typeof program.image === 'string' ? { uri: program.image } : (program.image as any);

            return (
              <View key={program.questId} style={styles.coverItem}>
                <View style={[
                  styles.coverImageWrap,
                  isCurrent && styles.coverImageCurrent,
                  isCompleted && styles.coverImageCompleted,
                ]}>
                  <Image source={imgSrc} style={styles.coverImage} />
                  {isCompleted && (
                    <View style={styles.coverCheck}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                  {!isCompleted && !isCurrent && !program.isUnlocked && (
                    <View style={styles.coverLock}>
                      <Ionicons name="lock-closed" size={8} color={colors.textMuted} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.coverTitle,
                  isCurrent && styles.coverTitleCurrent,
                  !isCompleted && !isCurrent && !program.isUnlocked && styles.coverTitleLocked,
                ]} numberOfLines={2}>{program.title}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Streak banner */}
      <View style={styles.streakBanner}>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFlame}>{'\u{1F525}'}</Text>
          <Text style={styles.streakCount}>{activeProgress.pathwayStreak}</Text>
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>
            {activeProgress.pathwayStreak > 0 ? `${activeProgress.pathwayStreak} day streak` : 'Start your streak!'}
          </Text>
          <Text style={styles.streakSub}>
            {activeProgress.weeklyLessonCount}/{activeProgress.weeklyLessonGoal} lessons this week
          </Text>
        </View>
        <Text style={styles.socialPill}>
          {SOCIAL_PROOF.activeLearners.toLocaleString()} active
        </Text>
      </View>

      {/* Phase progress */}
      <View style={styles.bottomRow}>
        <Text style={styles.phaseText}>
          {currentPhase?.icon} {currentPhase?.name} · {completedInPhase}/{totalInPhase} programs
        </Text>
        <View style={styles.miniProgressTrack}>
          <View style={[styles.miniProgressFill, { width: `${phaseProgress * 100}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    fontWeight: '600',
  },
  pathwayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  switchText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Hero block
  heroBlock: {
    marginHorizontal: 12,
    borderRadius: 14,
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 10,
    color: '#ccc',
  },
  upNext: {
    fontSize: 11,
    color: '#7B68EE',
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#7B68EE',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Program covers
  coversRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  coverItem: {
    width: 64,
    alignItems: 'center',
  },
  coverImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
    marginBottom: 4,
  },
  coverImageCurrent: {
    borderWidth: 2,
    borderColor: '#7B68EE',
  },
  coverImageCompleted: {
    opacity: 0.6,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverLock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,14,23,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverTitle: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 11,
  },
  coverTitleCurrent: {
    color: '#fff',
    fontWeight: '600',
  },
  coverTitleLocked: {
    color: colors.textMuted,
  },

  // Streak banner
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(245,200,66,0.06)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,200,66,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  streakFlame: {
    fontSize: 16,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.gold,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  streakSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  socialPill: {
    fontSize: 10,
    color: colors.textMuted,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Bottom row (phase progress)
  bottomRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  phaseText: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
    marginBottom: 4,
  },
  miniProgressTrack: {
    height: 4,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.teal,
  },
});

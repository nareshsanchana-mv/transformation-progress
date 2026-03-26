// src/components/MyPathwayCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={[styles.heroBlock, { backgroundColor: activePathway.gradientColors[0] }]}>
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

      {/* Bottom compact row */}
      <View style={styles.bottomRow}>
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseText}>
            {currentPhase?.icon} {currentPhase?.name} · {completedInPhase}/{totalInPhase} programs
          </Text>
          <View style={styles.miniProgressTrack}>
            <View style={[styles.miniProgressFill, { width: `${phaseProgress * 100}%` }]} />
          </View>
        </View>
        <View style={styles.statsRow}>
          {activeProgress.pathwayStreak > 0 && (
            <Text style={styles.statText}>
              <Text style={{ color: colors.gold }}>{'\u{1F525}'} {activeProgress.pathwayStreak}</Text>
            </Text>
          )}
          <Text style={styles.statText}>
            {activeProgress.weeklyLessonCount}/{activeProgress.weeklyLessonGoal}{' '}
            <Text style={styles.statLabel}>wk</Text>
          </Text>
        </View>
      </View>

      {/* Social proof */}
      <View style={styles.socialRow}>
        <Text style={styles.socialText}>
          {SOCIAL_PROOF.activeLearners.toLocaleString()} active learners
        </Text>
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
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
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

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  phaseInfo: {
    flex: 1,
    marginRight: 12,
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
    width: 120,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.teal,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '400',
  },

  // Social proof
  socialRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  socialText: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.backgroundElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

// src/components/JourneyMapCard.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { Pathway, UserPathwayProgress, SOCIAL_PROOF, getPercentile, getNextMilestonePercentile, getLessonsToNextMilestone, COMPARATIVE_STATS } from '../data/pathwayData';
import JourneyWaypoint from './JourneyWaypoint';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COVER_SIZE = 52;
const COVER_GAP = 6;
const PATH_PADDING = 16;

interface JourneyMapCardProps {
  pathway: Pathway;
  progress: UserPathwayProgress;
}

export default function JourneyMapCard({ pathway, progress }: JourneyMapCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const scrollRef = useRef<ScrollView>(null);

  const completedCount = progress.completedPrograms.length;
  const overallPercent = Math.round((completedCount / pathway.totalPrograms) * 100);
  const isJourneyComplete = progress.completedPhases.length === pathway.phases.length;

  // Auto-scroll to current program on mount
  useEffect(() => {
    // Estimate position of current program in the flat list
    let programIndex = 0;
    let separatorsBefore = 0;
    for (const phase of pathway.phases) {
      if (phase.id === progress.currentPhaseId) {
        const progIdx = phase.programs.findIndex(p => p.questId === progress.currentProgramId);
        programIndex += Math.max(0, progIdx);
        break;
      }
      programIndex += phase.programs.length;
      separatorsBefore++;
    }
    if (programIndex > 2 && scrollRef.current) {
      const scrollTo = programIndex * (COVER_SIZE + COVER_GAP) + separatorsBefore * 54 - SCREEN_WIDTH / 2 + COVER_SIZE / 2;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, scrollTo), animated: true });
      }, 300);
    }
  }, [progress.currentProgramId]);

  const getWaypointState = (phaseId: string): 'completed' | 'current' | 'locked' => {
    if (progress.completedPhases.includes(phaseId)) return 'completed';
    if (phaseId === progress.currentPhaseId) return 'current';
    return 'locked';
  };

  const navigateToPathway = () => {
    navigation.navigate('PathwayDetail', { pathwayId: pathway.id });
  };

  const percentile = getPercentile(completedCount, pathway.totalPrograms);

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: pathway.accentColor + '20' }]}
      activeOpacity={0.9}
      onPress={navigateToPathway}
    >
      {/* Journey Complete overlay */}
      {isJourneyComplete && (
        <View style={styles.completeOverlay}>
          <Text style={styles.completeText}>Journey Complete</Text>
          <Text style={styles.completeStats}>
            {pathway.totalPrograms} programs · {pathway.totalLessons} lessons · {progress.totalHoursLearned}h invested
          </Text>
        </View>
      )}

      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{pathway.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{pathway.name}</Text>
            <Text style={styles.headerTagline}>{pathway.tagline}</Text>
          </View>
        </View>
      </View>

      {/* Horizontal Path: covers at the top */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pathContent}
        style={styles.pathScroll}
      >
        {pathway.phases.map((phase, phaseIndex) => {
          const phaseState = getWaypointState(phase.id);
          const isLastPhase = phaseIndex === pathway.phases.length - 1;

          return (
            <View key={phase.id} style={styles.phaseGroup}>
              {/* Phase separator (small) */}
              {phaseIndex > 0 && (
                <JourneyWaypoint
                  state={phaseState}
                  phaseIcon={phase.icon}
                  phaseName={phase.name}
                  accentColor={pathway.accentColor}
                />
              )}

              {/* Program covers */}
              {phase.programs.map((program) => {
                const isDone = progress.completedPrograms.includes(program.questId);
                const isCurrent = program.questId === progress.currentProgramId;
                const isLocked = !isDone && !isCurrent && !program.isUnlocked;

                return (
                  <View key={program.questId} style={styles.coverItem}>
                    <View style={[
                      styles.coverWrap,
                      isCurrent && [styles.coverCurrent, { borderColor: pathway.accentColor }],
                      isDone && styles.coverDone,
                      isLocked && styles.coverLocked,
                    ]}>
                      <Image source={{ uri: program.image }} style={styles.coverImage} />
                      {isDone && (
                        <View style={styles.coverCheck}>
                          <Text style={styles.coverCheckText}>{'\u2713'}</Text>
                        </View>
                      )}
                      {isLocked && (
                        <View style={styles.coverLockOverlay} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.coverTitle,
                        isCurrent && styles.coverTitleCurrent,
                        isLocked && styles.coverTitleLocked,
                      ]}
                      numberOfLines={2}
                    >
                      {program.title}
                    </Text>
                    {/* YOU ARE HERE + social proof under current program */}
                    {isCurrent && (
                      <View style={styles.currentIndicator}>
                        <Text style={[styles.youAreHere, { color: pathway.accentColor }]}>YOU ARE HERE</Text>
                        <Text style={styles.socialProof}>Ahead of {percentile}% of learners</Text>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Show phase completion stat after last cover of a completed phase */}
              {phaseState === 'completed' && !isLastPhase && (
                <View style={styles.phaseStatWrap}>
                  <Text style={styles.phaseStat}>
                    {(SOCIAL_PROOF.phaseCompletions[phase.id] ?? 0).toLocaleString()} completed
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Progress Bar + Stats */}
      <View style={styles.statsSection}>
        <View style={styles.progressBarRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${overallPercent}%`, backgroundColor: pathway.accentColor }]} />
          </View>
          <Text style={[styles.progressPercent, { color: pathway.accentColor }]}>{overallPercent}%</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{completedCount}/{pathway.totalPrograms}</Text>
            <Text style={styles.statPillLabel}>programs</Text>
          </View>
          {progress.pathwayStreak > 0 && (
            <View style={[styles.statPill, styles.statPillHighlight]}>
              <Text style={[styles.statPillValue, { color: colors.gold }]}>{'\u{1F525}'} {progress.pathwayStreak}</Text>
              <Text style={styles.statPillLabel}>streak</Text>
            </View>
          )}
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{progress.weeklyLessonCount}/{progress.weeklyLessonGoal}</Text>
            <Text style={styles.statPillLabel}>this week</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{progress.totalHoursLearned}h</Text>
            <Text style={styles.statPillLabel}>learned</Text>
          </View>
        </View>
      </View>

      {/* Comparative user stats */}
      {completedCount > 0 && (
        <View style={styles.comparativeSection}>
          <View style={styles.comparativeRow}>
            <View style={[styles.comparativeIcon, { backgroundColor: 'rgba(123,104,238,0.15)' }]}>
              <Text style={{ fontSize: 12 }}>{'\u{1F3C6}'}</Text>
            </View>
            <Text style={styles.comparativeText}>
              You're in the <Text style={[styles.comparativeHighlight, { color: pathway.accentColor }]}>top {100 - percentile}%</Text> of {pathway.name} learners
            </Text>
          </View>
          <View style={styles.comparativeRow}>
            <View style={[styles.comparativeIcon, { backgroundColor: 'rgba(0,212,170,0.15)' }]}>
              <Text style={{ fontSize: 12 }}>{'\u{23F1}'}</Text>
            </View>
            <Text style={styles.comparativeText}>
              <Text style={styles.comparativeHighlight}>{COMPARATIVE_STATS.paceCompletion}%</Text> at your stage finish their next program within <Text style={styles.comparativeHighlight}>{COMPARATIVE_STATS.paceWeeks} weeks</Text>
            </Text>
          </View>
          <View style={styles.comparativeRow}>
            <View style={[styles.comparativeIcon, { backgroundColor: 'rgba(245,200,66,0.15)' }]}>
              <Text style={{ fontSize: 12 }}>{'\u{1F3AF}'}</Text>
            </View>
            <Text style={styles.comparativeText}>
              <Text style={[styles.comparativeHighlight, { color: colors.gold }]}>{getLessonsToNextMilestone(completedCount, pathway.totalPrograms)} more lessons</Text> to reach top {100 - getNextMilestonePercentile(percentile)}%
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },

  // Complete overlay
  completeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,212,170,0.08)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.teal,
    marginBottom: 4,
  },
  completeStats: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  headerTagline: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  // Stats section
  statsSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 40,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statPillHighlight: {
    backgroundColor: 'rgba(245,200,66,0.1)',
  },
  statPillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  statPillLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Path
  pathScroll: {
    marginVertical: 8,
  },
  pathContent: {
    paddingHorizontal: PATH_PADDING,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  phaseGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Program covers — the primary visual
  coverItem: {
    alignItems: 'center',
    width: COVER_SIZE + 10,
    marginRight: COVER_GAP,
  },
  coverWrap: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
  },
  coverCurrent: {
    borderWidth: 2,
  },
  coverDone: {
    opacity: 0.5,
  },
  coverLocked: {
    opacity: 0.2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverCheckText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '700',
  },
  coverLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,14,23,0.5)',
  },
  coverTitle: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 10,
  },
  coverTitleCurrent: {
    color: '#fff',
    fontWeight: '600',
  },
  coverTitleLocked: {
    color: colors.textMuted,
  },

  // Current program indicator
  currentIndicator: {
    alignItems: 'center',
    marginTop: 4,
  },
  youAreHere: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  socialProof: {
    fontSize: 7,
    color: colors.textMuted,
    marginTop: 1,
  },

  // Phase completion stat
  phaseStatWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18,
    marginRight: 4,
  },
  phaseStat: {
    fontSize: 7,
    color: colors.teal,
    fontWeight: '500',
  },

  // Comparative user stats
  comparativeSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  comparativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comparativeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparativeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  comparativeHighlight: {
    fontWeight: '700',
    color: '#fff',
  },

});

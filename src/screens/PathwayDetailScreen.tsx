// src/screens/PathwayDetailScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';
import { SOCIAL_PROOF } from '../data/pathwayData';
import PhaseTimeline from '../components/PhaseTimeline';
import PhaseCollapsed from '../components/PhaseCollapsed';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PathwayDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activePathway, activeProgress } = usePathway();

  if (!activePathway || !activeProgress) return null;

  const completedProgramCount = activeProgress.completedPrograms.length;
  const overallProgress = activePathway.totalPrograms > 0
    ? completedProgramCount / activePathway.totalPrograms
    : 0;

  const currentPhaseIndex = activePathway.phases.findIndex(p => p.id === activeProgress.currentPhaseId);

  const navigateToQuest = (questId: string, title: string, image: string, author: string) => {
    navigation.navigate('QuestDetail', {
      questId,
      questTitle: title,
      questImage: image,
      author,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerSection, { backgroundColor: activePathway.gradientColors[0] }]}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            <View style={[styles.iconBox, { backgroundColor: activePathway.accentColor + '33' }]}>
              <Text style={styles.iconText}>{activePathway.icon}</Text>
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.pathwayTitle}>{activePathway.name} Pathway</Text>
              <Text style={styles.pathwayMeta}>
                {activePathway.totalPrograms} programs · {activePathway.totalLessons} lessons
              </Text>
            </View>
          </View>

          {/* Overall progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressPercent}>{Math.round(overallProgress * 100)}% complete</Text>
              <Text style={styles.progressCount}>{completedProgramCount} of {activePathway.totalPrograms} programs</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${overallProgress * 100}%` }]} />
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {activeProgress.pathwayStreak > 0 ? `\u{1F525} ${activeProgress.pathwayStreak}` : '0'}
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {activeProgress.weeklyLessonCount}/{activeProgress.weeklyLessonGoal}
              </Text>
              <Text style={styles.statLabel}>This week</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{activeProgress.totalHoursLearned}h</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
            <View style={[styles.statBox, { flex: 1 }]}>
              <Text style={[styles.statValue, { color: '#7B68EE' }]}>
                {'\u{1F3C6}'} {activeProgress.earnedBadges.length}
              </Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Social proof bar */}
        <View style={styles.socialBar}>
          <View style={styles.avatarStack}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.avatarDot, { marginLeft: i > 0 ? -8 : 0, backgroundColor: ['#4a3a6e', '#3a4a6e', '#6a3a4e'][i] }]} />
            ))}
          </View>
          <Text style={styles.socialText}>
            {SOCIAL_PROOF.activeLearners.toLocaleString()} active · {SOCIAL_PROOF.phaseCompletionRate}% finish Phase 1
          </Text>
        </View>

        {/* Phases */}
        <View style={styles.phasesSection}>
          {activePathway.phases.map((phase, index) => {
            const isCompleted = activeProgress.completedPhases.includes(phase.id);
            const isCurrent = phase.id === activeProgress.currentPhaseId;
            const isFuture = index > currentPhaseIndex;

            if (isCurrent) {
              return (
                <PhaseTimeline
                  key={phase.id}
                  phase={phase}
                  progress={activeProgress}
                  onProgramPress={navigateToQuest}
                />
              );
            }

            if (isCompleted) {
              return (
                <PhaseCollapsed
                  key={phase.id}
                  phase={phase}
                  state="completed"
                />
              );
            }

            // Future/locked
            const distanceFromCurrent = index - currentPhaseIndex;
            const opacity = Math.max(0.25, 0.6 - (distanceFromCurrent - 1) * 0.15);
            return (
              <PhaseCollapsed
                key={phase.id}
                phase={phase}
                state="locked"
                opacity={opacity}
              />
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  moreBtn: { padding: 4 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  titleInfo: { flex: 1 },
  pathwayTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  pathwayMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  progressSection: { marginBottom: 14 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressPercent: { fontSize: 12, color: colors.teal, fontWeight: '600' },
  progressCount: { fontSize: 12, color: colors.textMuted },
  progressTrack: {
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  socialBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(123,104,238,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123,104,238,0.15)',
    gap: 8,
  },
  avatarStack: { flexDirection: 'row' },
  avatarDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  socialText: { fontSize: 12, color: colors.textMuted },

  phasesSection: {
    padding: 20,
  },
});

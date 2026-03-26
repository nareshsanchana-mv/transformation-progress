// src/components/ProgramTimelineItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { PathwayProgram } from '../data/pathwayData';

type ProgramState = 'completed' | 'current' | 'locked';

interface ProgramTimelineItemProps {
  program: PathwayProgram;
  state: ProgramState;
  lessonProgress?: number; // current lesson / total lessons, 0-1
  currentLessonLabel?: string; // e.g., "Lesson 4 of 15 · 15 min"
  onPress?: () => void;
}

export default function ProgramTimelineItem({
  program,
  state,
  lessonProgress = 0,
  currentLessonLabel,
  onPress,
}: ProgramTimelineItemProps) {
  const imgSrc = typeof program.image === 'string' ? { uri: program.image } : (program.image as any);

  return (
    <View style={styles.row}>
      {/* Timeline dot */}
      <View style={styles.dotColumn}>
        {state === 'completed' && (
          <View style={styles.dotCompleted}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
        {state === 'current' && <View style={styles.dotCurrent} />}
        {state === 'locked' && <View style={styles.dotLocked} />}
      </View>

      {/* Program card */}
      <TouchableOpacity
        style={[
          styles.card,
          state === 'current' && styles.cardCurrent,
          state === 'completed' && styles.cardCompleted,
          state === 'locked' && styles.cardLocked,
        ]}
        activeOpacity={state === 'locked' ? 1 : 0.7}
        onPress={state !== 'locked' ? onPress : undefined}
      >
        <View style={styles.thumbWrap}>
          <Image source={imgSrc} style={styles.thumb} />
          {state === 'current' && (
            <View style={styles.playOverlay}>
              <Ionicons name="play" size={14} color="#fff" />
            </View>
          )}
          {state === 'locked' && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={14} color="#5A6577" />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, state === 'locked' && styles.textLocked]} numberOfLines={1}>
            {program.title}
          </Text>
          {state === 'completed' && (
            <Text style={styles.completedLabel}>Completed {'\u2713'}</Text>
          )}
          {state === 'current' && currentLessonLabel && (
            <>
              <Text style={styles.currentLabel}>{currentLessonLabel}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${lessonProgress * 100}%` }]} />
              </View>
            </>
          )}
          {state === 'locked' && (
            <Text style={styles.lockedLabel}>
              {program.isMostPopular ? 'Most popular in this phase' : 'Unlocks next'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dotColumn: {
    width: 30,
    alignItems: 'center',
  },
  dotCompleted: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  dotLocked: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  cardCurrent: {
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
  },
  cardCompleted: {
    opacity: 0.7,
  },
  cardLocked: {
    opacity: 0.4,
  },

  thumbWrap: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  textLocked: {
    color: colors.textMuted,
  },
  completedLabel: {
    fontSize: 11,
    color: colors.teal,
    marginTop: 2,
  },
  currentLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#7B68EE',
  },
  lockedLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

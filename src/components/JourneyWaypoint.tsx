// src/components/JourneyWaypoint.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type WaypointState = 'completed' | 'current' | 'locked';

interface JourneyWaypointProps {
  state: WaypointState;
  phaseIcon: string;
  label: string; // badge name for completed, "YOU ARE HERE" for current, phase name for locked
  socialProofText?: string;
  accentColor: string;
  onPress?: () => void;
}

const WAYPOINT_SIZE = 48;
const WAYPOINT_SIZE_CURRENT = 58;

export default function JourneyWaypoint({
  state,
  phaseIcon,
  label,
  socialProofText,
  accentColor,
  onPress,
}: JourneyWaypointProps) {
  const size = state === 'current' ? WAYPOINT_SIZE_CURRENT : WAYPOINT_SIZE;

  const handlePress = () => {
    if (state === 'locked') {
      // No navigation for locked — could add shake animation later
      return;
    }
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={state === 'locked' ? 1 : 0.7}
    >
      {/* Waypoint circle */}
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          state === 'completed' && styles.circleCompleted,
          state === 'current' && [styles.circleCurrent, { backgroundColor: accentColor, shadowColor: accentColor }],
          state === 'locked' && styles.circleLocked,
        ]}
      >
        {state === 'completed' && (
          <Ionicons name="checkmark" size={22} color="#fff" />
        )}
        {state === 'current' && (
          <Text style={styles.currentIcon}>{phaseIcon}</Text>
        )}
        {state === 'locked' && (
          <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
        )}
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          state === 'current' && styles.labelCurrent,
          state === 'locked' && styles.labelLocked,
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>

      {/* Social proof */}
      {socialProofText && (
        <Text style={styles.socialProof} numberOfLines={2}>
          {socialProofText}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 90,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleCompleted: {
    backgroundColor: colors.teal,
  },
  circleCurrent: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  circleLocked: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  currentIcon: {
    fontSize: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.teal,
    textAlign: 'center',
    lineHeight: 13,
  },
  labelCurrent: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  labelLocked: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  socialProof: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 12,
  },
});

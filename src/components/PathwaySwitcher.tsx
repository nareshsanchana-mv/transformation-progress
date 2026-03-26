// src/components/PathwaySwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';

interface PathwaySwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export default function PathwaySwitcher({ visible, onClose }: PathwaySwitcherProps) {
  const { ownedPathways, activePathwayId, setActivePathwayId } = usePathway();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Switch Pathway</Text>
          {ownedPathways.map(pw => (
            <TouchableOpacity
              key={pw.id}
              style={[styles.row, pw.id === activePathwayId && styles.rowActive]}
              onPress={() => { setActivePathwayId(pw.id); onClose(); }}
            >
              <Text style={styles.icon}>{pw.icon}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{pw.name}</Text>
                <Text style={styles.rowTagline}>{pw.tagline}</Text>
              </View>
              {pw.id === activePathwayId && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.backgroundElevated,
  },
  rowActive: {
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  rowTagline: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B68EE',
  },
});

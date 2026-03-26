import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';

const { width } = Dimensions.get('window');
const BADGE_SIZE_LG = (width - 64) / 2;   // 2-col
const BADGE_SIZE_SM = (width - 72) / 3;   // 3-col

// ─── Data ─────────────────────────────────────────────────────────────────

const STATS = [
  { id: 's1', label: 'MEDITATIONS LISTENED', value: '9',   icon: 'flower-outline',       iconBg: '#B45309', iconColor: '#FCD34D' },
  { id: 's2', label: 'MEDITATED',            value: '7h',  icon: 'time-outline',          iconBg: '#1D4ED8', iconColor: '#93C5FD' },
  { id: 's3', label: 'LESSONS COMPLETED',    value: '30',  icon: 'play-circle-outline',   iconBg: '#1D4ED8', iconColor: '#93C5FD' },
  { id: 's4', label: 'QUEST COMPLETED',      value: '1',   icon: 'book-outline',          iconBg: '#0D9488', iconColor: '#5EEAD4' },
];

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ACTIVE_DAYS: number[] = []; // 0 = current streak

const LEARNING_CATEGORIES = [
  { id: 'lc1', name: 'Mind',             icon: 'bulb-outline',          iconBg: '#1D4ED8', progress: 0.32 },
  { id: 'lc2', name: 'Body',             icon: 'fitness-outline',       iconBg: '#059669', progress: 0.18 },
  { id: 'lc3', name: 'Relationship',     icon: 'heart-outline',         iconBg: '#BE185D', progress: 0.12 },
  { id: 'lc4', name: 'Career',           icon: 'trending-up-outline',   iconBg: '#B45309', progress: 0.08 },
  { id: 'lc5', name: 'Soul',             icon: 'sunny-outline',         iconBg: '#A16207', progress: 0.22 },
  { id: 'lc6', name: 'Entrepreneurship', icon: 'rocket-outline',        iconBg: '#0D9488', progress: 0.05 },
];

// Earned badges (colorful images)
const EARNED_BADGES = [
  { id: 'b1', name: 'Balanced Mind',    date: '10/11/2025', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&q=80' },
  { id: 'b2', name: 'First Step',       date: '08/12/2025', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=80' },
  { id: 'b3', name: 'Tranquil Journey', date: '03/14/2025', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80' },
  { id: 'b4', name: 'Consistency Seed', date: '01/18/2025', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80' },
];

const STREAK_BADGES = [
  { id: 'sb1', name: 'Consistency Seed', date: '01/18/2025', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&q=80', earned: true },
  { id: 'sb2', name: 'Day One',          date: '01/16/2025', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&q=80', earned: true },
  { id: 'sb3', name: 'Week Warrior',     date: null,          image: null, earned: false },
  { id: 'sb4', name: 'Fortnight Focus',  date: null,          image: null, earned: false },
  { id: 'sb5', name: 'Habit Builder',    date: null,          image: null, earned: false },
  { id: 'sb6', name: 'Mindful Mastery',  date: null,          image: null, earned: false },
];

const QUEST_BADGES = [
  { id: 'qb1',  name: 'Balanced Mind',         date: '10/11/2025', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&q=80', earned: true },
  { id: 'qb2',  name: 'First Step',            date: '08/12/2025', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=80', earned: true },
  { id: 'qb3',  name: 'Tranquil Journey',      date: '03/14/2025', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80', earned: true },
  { id: 'qb4',  name: 'Calm Beginnings',       date: '01/16/2025', image: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=200&q=80', earned: true },
  { id: 'qb5',  name: 'Mindful Meditation',    date: null, image: null, earned: false },
  { id: 'qb6',  name: 'Peaceful Progress',     date: null, image: null, earned: false },
  { id: 'qb7',  name: 'Zen Master',            date: null, image: null, earned: false },
  { id: 'qb8',  name: 'Triple Triumph',        date: null, image: null, earned: false },
  { id: 'qb9',  name: 'Fifth Achievement',     date: null, image: null, earned: false },
  { id: 'qb10', name: 'Decade of Learning',    date: null, image: null, earned: false },
  { id: 'qb11', name: 'Fifteen Fulfillment',   date: null, image: null, earned: false },
  { id: 'qb12', name: 'Twenty Treasures',      date: null, image: null, earned: false },
  { id: 'qb13', name: 'Quarter Century',       date: null, image: null, earned: false },
  { id: 'qb14', name: 'Thirty Triumph',        date: null, image: null, earned: false },
  { id: 'qb15', name: 'Thirty-Five Brilliance',date: null, image: null, earned: false },
];

// ─── Badge component ──────────────────────────────────────────────────────

const Badge = ({
  item, size, showDate = true,
}: {
  item: { name: string; date: string | null; image: string | null; earned: boolean };
  size: number;
  showDate?: boolean;
}) => (
  <View style={[bdg.wrapper, { width: size }]}>
    <View style={[bdg.octagon, { width: size, height: size, borderRadius: size * 0.2 },
      item.earned ? bdg.octagonEarned : bdg.octagonLocked]}>
      {item.earned && item.image ? (
        <Image source={{ uri: item.image }} style={[bdg.image, { width: size, height: size, borderRadius: size * 0.2 }]} />
      ) : (
        <View style={bdg.lockedInner}>
          <Ionicons name="shield-outline" size={size * 0.35} color="#3A3F4B" />
        </View>
      )}
    </View>
    <Text style={[bdg.name, !item.earned && bdg.nameLocked]} numberOfLines={2}>{item.name}</Text>
    {showDate && item.date && <Text style={bdg.date}>{item.date}</Text>}
  </View>
);

const bdg = StyleSheet.create({
  wrapper: { alignItems: 'center', marginBottom: 24 },
  octagon: { overflow: 'hidden', borderWidth: 1.5 },
  octagonEarned: { borderColor: 'rgba(212,175,55,0.5)' },
  octagonLocked: { borderColor: '#2A2E38', backgroundColor: '#1A1D25' },
  image: { resizeMode: 'cover' },
  lockedInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '600', color: '#fff', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  nameLocked: { color: colors.textMuted },
  date: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});

// ─── Overview tab ─────────────────────────────────────────────────────────

const OverviewTab = () => {
  const { ownedPathways, scenario } = usePathway();
  return (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
    {/* Pathways */}
    {ownedPathways.length > 0 && (
      <View style={{ marginBottom: 20 }}>
        <Text style={ov.sectionTitle}>Pathways</Text>
        {ownedPathways.map(pw => {
          const progress = scenario.progressMap[pw.id];
          if (!progress) return null;
          const completedCount = progress.completedPrograms.length;
          const percentage = Math.round((completedCount / pw.totalPrograms) * 100);
          return (
            <View key={pw.id} style={{
              backgroundColor: colors.backgroundCard, borderRadius: 14, padding: 16,
              borderWidth: 1, borderColor: colors.border, marginBottom: 10,
              flexDirection: 'row', alignItems: 'center', gap: 12,
            }}>
              <Text style={{ fontSize: 24 }}>{pw.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{pw.name} Pathway</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <View style={{ flex: 1, height: 4, backgroundColor: colors.backgroundElevated, borderRadius: 2 }}>
                    <View style={{ width: `${percentage}%`, height: 4, borderRadius: 2, backgroundColor: pw.accentColor }} />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{percentage}%</Text>
                </View>
                {progress.earnedBadges.length > 0 && (
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                    {progress.earnedBadges.map((badge, i) => (
                      <View key={i} style={{
                        backgroundColor: 'rgba(245,200,66,0.15)', paddingHorizontal: 8, paddingVertical: 3,
                        borderRadius: 10,
                      }}>
                        <Text style={{ fontSize: 10, color: colors.gold }}>{'\u{1F3C6}'} {badge}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    )}

    {/* Streak card */}
    <View style={ov.streakCard}>
      <View style={ov.streakLeft}>
        <View style={ov.streakHex}>
          <Text style={ov.streakNum}>0</Text>
        </View>
        <View>
          <Text style={ov.streakValue}>0</Text>
          <Text style={ov.streakLabel}>DAY STREAK</Text>
        </View>
      </View>
      <View style={ov.weekRow}>
        {WEEK_DAYS.map((d, i) => (
          <View key={i} style={[ov.dayDot, ACTIVE_DAYS.includes(i) && ov.dayDotActive]}>
            <Text style={[ov.dayText, ACTIVE_DAYS.includes(i) && ov.dayTextActive]}>{d}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Stats 2×2 */}
    <View style={ov.statsGrid}>
      {STATS.map(s => (
        <View key={s.id} style={ov.statCard}>
          <View style={[ov.statIcon, { backgroundColor: s.iconBg + '33' }]}>
            <Ionicons name={s.icon as any} size={22} color={s.iconColor} />
          </View>
          <Text style={ov.statValue}>{s.value}</Text>
          <Text style={ov.statLabel}>{s.label}</Text>
        </View>
      ))}
    </View>

    {/* Achievements preview */}
    <View style={ov.sectionHeader}>
      <Text style={ov.sectionTitle}>Achievements</Text>
      <TouchableOpacity><Text style={ov.seeAll}>See all</Text></TouchableOpacity>
    </View>
    <View style={ov.badgeGrid}>
      {EARNED_BADGES.map(b => (
        <Badge key={b.id} item={{ ...b, earned: true }} size={BADGE_SIZE_LG} />
      ))}
    </View>

    {/* Learning Progress */}
    <Text style={ov.sectionTitle}>Learning Progress</Text>
    <View style={ov.progressCard}>
      {LEARNING_CATEGORIES.map(cat => (
        <View key={cat.id} style={ov.progressRow}>
          <View style={[ov.catIcon, { backgroundColor: cat.iconBg }]}>
            <Ionicons name={cat.icon as any} size={16} color="#fff" />
          </View>
          <View style={ov.progressRight}>
            <Text style={ov.catName}>{cat.name}</Text>
            <View style={ov.barBg}>
              <View style={[ov.barFill, { width: `${cat.progress * 100}%`, backgroundColor: cat.iconBg }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
); };

const ov = StyleSheet.create({
  streakCard: {
    backgroundColor: colors.backgroundCard, borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  streakHex: {
    width: 52, height: 52, borderRadius: 10,
    backgroundColor: colors.backgroundElevated, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  streakNum: { fontSize: 22, fontWeight: '900', color: colors.textMuted },
  streakValue: { fontSize: 28, fontWeight: '900', color: '#fff' },
  streakLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.backgroundElevated, alignItems: 'center', justifyContent: 'center',
  },
  dayDotActive: { backgroundColor: '#7C5CFC' },
  dayText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  dayTextActive: { color: '#fff' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: {
    width: (width - 52) / 2, backgroundColor: colors.backgroundCard,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border,
    alignItems: 'flex-start',
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, lineHeight: 14 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  seeAll: { fontSize: 14, color: colors.teal },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  progressCard: {
    backgroundColor: colors.backgroundCard, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  catIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  progressRight: { flex: 1 },
  catName: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6 },
  barBg: { height: 4, backgroundColor: colors.backgroundElevated, borderRadius: 2 },
  barFill: { height: 4, borderRadius: 2 },
});

// ─── Achievements tab ─────────────────────────────────────────────────────

const AchievementsTab = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
    {/* Recent */}
    <Text style={ach.sectionTitle}>Recent</Text>
    <View style={ach.gridLg}>
      {EARNED_BADGES.map(b => (
        <Badge key={b.id} item={{ ...b, earned: true }} size={BADGE_SIZE_LG} />
      ))}
    </View>

    {/* Streaks */}
    <Text style={ach.sectionTitle}>Streaks</Text>
    <View style={ach.gridSm}>
      {STREAK_BADGES.map(b => (
        <Badge key={b.id} item={b} size={BADGE_SIZE_SM} />
      ))}
    </View>

    {/* Quest & Meditation Completions */}
    <Text style={ach.sectionTitle}>Quest & Meditation Completions</Text>
    <View style={ach.gridSm}>
      {QUEST_BADGES.map(b => (
        <Badge key={b.id} item={b} size={BADGE_SIZE_SM} />
      ))}
    </View>
  </ScrollView>
);

const ach = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 20 },
  gridLg: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridSm: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

// ─── Main screen ──────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Achievements'>('Overview');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.tabBar}>
        {(['Overview', 'Achievements'] as const).map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Overview'      && <OverviewTab />}
      {activeTab === 'Achievements'  && <AchievementsTab />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 10,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tabItem: { marginRight: 24, paddingBottom: 12, paddingTop: 4, position: 'relative' },
  tabText: { fontSize: 16, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#fff', borderRadius: 1,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import Section from '../components/Section';
import ProgramCard from '../components/ProgramCard';
import ContinueProgramCard from '../components/ContinueProgramCard';
import FeaturedBanner from '../components/FeaturedBanner';
import LiveClassCard from '../components/LiveClassCard';
import FavoriteCard from '../components/FavoriteCard';
import SoundCard from '../components/SoundCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useUser } from '../context/UserContext';
import {
  eveRecommendations,
  freePrograms,
  todayMeditations,
  popularPrograms,
  dailyShorts,
  // L3/L4 data
  continuePrograms,
  premiumPrograms,
  favorites,
  featuredBanners,
  growthGoalsPrograms,
  meditationsForGoal,
  soundsForGoal,
  liveClasses,
} from '../data/mockData';
import MyPathwayCard from '../components/MyPathwayCard';
import PathwaySwitcher from '../components/PathwaySwitcher';
import MilestoneCelebration from '../components/MilestoneCelebration';
import ProgramCompleteCelebration from '../components/ProgramCompleteCelebration';
import { usePathway } from '../context/PathwayContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TodayScreen() {
  const { isSubscriber, userName, dayStreak, userTier } = useUser();
  const navigation = useNavigation<NavigationProp>();
  const { hasPathway, activeProgress } = usePathway();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const navigateToQuest = (questId: string, title: string, image: string, author: string) => {
    navigation.navigate('QuestDetail', {
      questId,
      questTitle: title,
      questImage: image,
      author,
    });
  };

  const navigateToMeditation = (id: string, title: string, author: string, image: string, duration: string, rating?: number) => {
    navigation.navigate('MeditationPlayer', {
      id,
      title,
      author,
      image,
      duration,
      rating,
    });
  };

  const navigateToSound = (id: string, title: string, author: string, image: string, rating?: number) => {
    navigation.navigate('SoundPlayer', {
      id,
      title,
      author,
      image,
      rating,
    });
  };

  const navigateToShorts = (index: number) => {
    navigation.navigate('ShortsPlayer', {
      initialIndex: index,
    });
  };

  const filteredContinuePrograms = hasPathway && activeProgress
    ? continuePrograms.filter(p => !activeProgress.completedPrograms.includes(p.id) && p.id !== activeProgress.currentProgramId)
    : continuePrograms;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hi, {userName}</Text>
        </View>

        {/* My Pathway */}
        {hasPathway && (
          <MyPathwayCard onSwitchPress={() => setShowSwitcher(true)} />
        )}

        {isSubscriber ? (
          // L3/L4 Subscriber Experience
          <>
            {/* 1. Continue Programs */}
            <Section title="Continue programs" showSeeAll horizontal>
              {filteredContinuePrograms.map((program) => (
                <ContinueProgramCard
                  key={program.id}
                  {...program}
                  onPress={() => navigateToQuest(
                    program.id === '1' ? 'silva-ultramind' : 'manifesting-mastery',
                    program.programName,
                    program.image,
                    program.author
                  )}
                />
              ))}
            </Section>

            {/* 2. Live Classes (L3L4 only at this position) */}
            {userTier === 'L3L4' && (
              <View style={styles.liveClassesSection}>
                <View style={styles.liveClassesHeader}>
                  <Text style={styles.sectionTitle}>Live classes</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                {liveClasses.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    {...liveClass}
                  />
                ))}
              </View>
            )}

            {/* 3. Your Premium Programs (L3L4 only) */}
            {userTier === 'L3L4' && (
              <Section title="Your premium programs" horizontal>
                {premiumPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    {...program}
                    coverImage={program.image}
                    type="program"
                    size="large"
                    onPress={() => navigateToQuest(
                      'silva-ultramind',
                      program.title,
                      program.image,
                      program.author
                    )}
                  />
                ))}
              </Section>
            )}

            {/* 4. Your Meditations for Today */}
            <Section title="Your meditations for today">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {todayMeditations.map((med) => (
                  <TouchableOpacity
                    key={med.id}
                    style={styles.meditationCard}
                    onPress={() => navigateToMeditation(
                      med.id,
                      med.title,
                      med.author,
                      med.image,
                      med.duration,
                      med.rating
                    )}
                    activeOpacity={0.8}
                  >
                    <View style={styles.meditationCategory}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.meditationCategoryText}>{med.category}</Text>
                    </View>
                    <Image
                      source={{ uri: med.image }}
                      style={styles.meditationImage}
                    />
                    <Text style={styles.meditationTitle} numberOfLines={2}>
                      {med.title}
                    </Text>
                    <Text style={styles.meditationAuthor}>{med.author}</Text>
                    <View style={styles.meditationMeta}>
                      <Text style={styles.meditationRating}>{med.rating}</Text>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={styles.meditationDuration}> · {med.duration}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Section>

            {/* 5. Favorites */}
            <Section title="Favorites" horizontal>
              {favorites.map((fav) => (
                <FavoriteCard
                  key={fav.id}
                  {...fav}
                />
              ))}
            </Section>

            {/* 6. Based on your Growth Goals */}
            <View style={styles.growthGoalsSection}>
              <View style={styles.growthGoalsHeader}>
                <Text style={styles.sectionTitle}>Based on your growth goals</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.growthGoalsContent}
              >
                {growthGoalsPrograms.map((program) => (
                  <TouchableOpacity
                    key={program.id}
                    style={styles.growthGoalCard}
                    onPress={() => navigateToQuest(
                      'silva-ultramind',
                      program.title,
                      program.image,
                      program.author
                    )}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: program.image }}
                      style={styles.growthGoalImage}
                    />
                    <Text style={styles.growthGoalTitle}>{program.title}</Text>
                    <Text style={styles.growthGoalAuthor}>{program.author}</Text>
                    <View style={styles.growthGoalMeta}>
                      <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                      <Text style={styles.growthGoalMetaText}>
                        {program.userCount?.toLocaleString()}
                      </Text>
                      <Text style={styles.growthGoalMetaText}>
                        {' '}  ·  {program.lessonCount} lessons
                      </Text>
                    </View>
                    {program.tag && (
                      <View style={styles.growthGoalTag}>
                        <Text style={styles.growthGoalTagText}>{program.tag}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 7. Featured */}
            <View style={styles.featuredSection}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                style={styles.featuredScroll}
              >
                {featuredBanners.map((banner) => (
                  <FeaturedBanner
                    key={banner.id}
                    {...banner}
                  />
                ))}
              </ScrollView>
              <View style={styles.paginationDots}>
                {featuredBanners.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, index === 0 && styles.activeDot]}
                  />
                ))}
              </View>
            </View>

            {/* 8. Daily Shorts */}
            <Section title="Daily shorts" horizontal>
              {dailyShorts.map((short, index) => (
                <TouchableOpacity
                  key={short.id}
                  style={styles.shortCard}
                  onPress={() => navigateToShorts(index)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: short.image }} style={styles.shortImage} />
                  <View style={styles.shortOverlay}>
                    <View style={styles.shortLogo}>
                      <Ionicons name="chevron-down" size={14} color="#fff" />
                    </View>
                    <Text style={styles.shortTitle} numberOfLines={2}>
                      {short.title}
                    </Text>
                    <Text style={styles.shortAuthor}>{short.author}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Section>

            {/* 9. Meditations for Better Sleep */}
            <Section
              title={`Meditations for `}
              subtitle={meditationsForGoal.goal}
              horizontal
            >
              {meditationsForGoal.meditations.map((med) => (
                <TouchableOpacity
                  key={med.id}
                  style={styles.meditationCard}
                  onPress={() => navigateToMeditation(
                    med.id,
                    med.title,
                    med.author,
                    med.image,
                    med.duration,
                    med.rating
                  )}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: med.image }}
                    style={styles.meditationImage}
                  />
                  <Text style={styles.meditationTitle} numberOfLines={2}>
                    {med.title}
                  </Text>
                  <Text style={styles.meditationAuthor}>{med.author}</Text>
                  <View style={styles.meditationMeta}>
                    <Text style={styles.meditationRating}>{med.rating}</Text>
                    <Ionicons name="star" size={12} color="#FFB800" />
                    <Text style={styles.meditationDuration}> · {med.duration}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Section>

            {/* 10. Sounds for Focus */}
            <Section
              title={`Sounds for `}
              subtitle={soundsForGoal.goal}
              horizontal
            >
              {soundsForGoal.sounds.map((sound) => (
                <SoundCard
                  key={sound.id}
                  {...sound}
                  onPress={() => navigateToSound(
                    sound.id,
                    sound.title,
                    sound.author,
                    sound.image,
                    sound.rating
                  )}
                />
              ))}
            </Section>

            {/* Live Classes (L3 only - at end position) */}
            {userTier === 'L3' && (
              <View style={styles.liveClassesSection}>
                <View style={styles.liveClassesHeader}>
                  <Text style={styles.sectionTitle}>Live classes</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                {liveClasses.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    {...liveClass}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          // L1 Free User Experience
          <>
            {/* Eve's Recommendations */}
            <View style={styles.eveSection}>
              <View style={styles.eveSectionHeader}>
                <View style={styles.eveIconSmall}>
                  <Ionicons name="cube-outline" size={16} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.eveSectionTitle}>
                    Eve's recommendation for {userName}
                  </Text>
                  <Text style={styles.eveSectionSubtitle}>
                    Curated content to help you achieve your goals.
                  </Text>
                </View>
              </View>

              {/* Recommendation reason pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.reasonsScroll}
                contentContainerStyle={styles.reasonsContent}
              >
                {eveRecommendations.map((rec, index) => (
                  <View key={index} style={styles.reasonPill}>
                    <Ionicons name="sparkles" size={12} color={colors.primary} />
                    <Text style={styles.reasonText} numberOfLines={2}>
                      {rec.reason}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Recommendation cards */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsScroll}
              >
                {eveRecommendations.map((item) => (
                  <ProgramCard
                    key={item.id}
                    {...item}
                    coverImage={item.image}
                    size="medium"
                  />
                ))}
              </ScrollView>

              {/* All recommendations button */}
              <TouchableOpacity style={styles.allRecsButton}>
                <Text style={styles.allRecsText}>All my recommendations</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Free Programs */}
            <Section title="Free programs for you" horizontal>
              {freePrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  {...program}
                  coverImage={program.image}
                  type="program"
                  size="large"
                  onPress={() => navigateToQuest(
                    'silva-ultramind',
                    program.title,
                    program.image,
                    program.author
                  )}
                />
              ))}
            </Section>

            {/* Today's Meditations */}
            <Section title="Your meditations for today">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {todayMeditations.map((med) => (
                  <TouchableOpacity
                    key={med.id}
                    style={styles.meditationCard}
                    onPress={() => navigateToMeditation(
                      med.id,
                      med.title,
                      med.author,
                      med.image,
                      med.duration,
                      med.rating
                    )}
                    activeOpacity={0.8}
                  >
                    <View style={styles.meditationCategory}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.meditationCategoryText}>{med.category}</Text>
                    </View>
                    <Image
                      source={{ uri: med.image }}
                      style={styles.meditationImage}
                    />
                    <Text style={styles.meditationTitle} numberOfLines={2}>
                      {med.title}
                    </Text>
                    <Text style={styles.meditationAuthor}>{med.author}</Text>
                    <View style={styles.meditationMeta}>
                      <Text style={styles.meditationRating}>{med.rating}</Text>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={styles.meditationDuration}> · {med.duration}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Section>

            {/* Popular Now */}
            <Section
              title="Popular now"
              subtitle="Update your profile to get personalized program recommendations."
              horizontal
            >
              {popularPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  {...program}
                  coverImage={program.image}
                  type="program"
                  size="large"
                  onPress={() => navigateToQuest(
                    'silva-ultramind',
                    program.title,
                    program.image,
                    program.author
                  )}
                />
              ))}
            </Section>

            {/* Daily Shorts */}
            <Section title="Daily shorts" horizontal>
              {dailyShorts.map((short, index) => (
                <TouchableOpacity
                  key={short.id}
                  style={styles.shortCard}
                  onPress={() => navigateToShorts(index)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: short.image }} style={styles.shortImage} />
                  <View style={styles.shortOverlay}>
                    <View style={styles.shortLogo}>
                      <Ionicons name="chevron-down" size={14} color="#fff" />
                    </View>
                    <Text style={styles.shortTitle} numberOfLines={2}>
                      {short.title}
                    </Text>
                    <Text style={styles.shortAuthor}>{short.author}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Section>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
      <PathwaySwitcher visible={showSwitcher} onClose={() => setShowSwitcher(false)} />
      <MilestoneCelebration />
      <ProgramCompleteCelebration />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greetingText: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  // Eve Section (L1)
  eveSection: {
    backgroundColor: colors.backgroundCard,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  eveSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  eveIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eveSectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eveSectionSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  reasonsScroll: {
    marginBottom: 16,
  },
  reasonsContent: {
    paddingHorizontal: 16,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    maxWidth: 200,
  },
  reasonText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  cardsScroll: {
    paddingHorizontal: 16,
  },
  allRecsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  allRecsText: {
    ...typography.label,
    color: colors.textPrimary,
    marginRight: 4,
  },
  // Meditation cards
  meditationCard: {
    width: 160,
    marginRight: 12,
  },
  meditationCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meditationCategoryText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  meditationImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  meditationTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  meditationAuthor: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationRating: {
    ...typography.caption,
    color: colors.textMuted,
    marginRight: 2,
  },
  meditationDuration: {
    ...typography.caption,
    color: colors.textMuted,
  },
  // Daily Shorts
  shortCard: {
    width: 140,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  shortImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundCard,
  },
  shortOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  shortLogo: {
    position: 'absolute',
    top: -30,
    left: 12,
  },
  shortTitle: {
    ...typography.bodySmall,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  shortAuthor: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  // Growth Goals Section (L3/L4)
  growthGoalsSection: {
    marginBottom: 24,
  },
  growthGoalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  growthGoalsTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  growthGoalsContent: {
    paddingHorizontal: 16,
  },
  growthGoalCard: {
    width: 280,
    marginRight: 16,
  },
  growthGoalImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.backgroundCard,
  },
  growthGoalTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  growthGoalAuthor: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  growthGoalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthGoalMetaText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  growthGoalTag: {
    backgroundColor: colors.backgroundElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  growthGoalTagText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  // Featured Section (L3/L4)
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  featuredScroll: {
    marginBottom: 12,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.textPrimary,
  },
  // Authors Section (L3/L4)
  authorsSection: {
    marginBottom: 24,
  },
  authorsContent: {
    paddingHorizontal: 16,
  },
  // Live Classes Section (L3/L4)
  liveClassesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  liveClassesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllText: {
    ...typography.label,
    color: colors.textAction,
  },
  bottomPadding: {
    height: 100,
  },
});

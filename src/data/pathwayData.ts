// src/data/pathwayData.ts

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PathwayProgram {
  questId: string;
  title: string;
  author: string;
  image: string;
  lessonCount: number;
  order: number;
  isUnlocked: boolean;
  isMostPopular?: boolean; // "Most popular in this phase" label
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  phaseNumber: number;
  icon: string;
  programs: PathwayProgram[];
  badgeName: string; // e.g., "Foundation Builder"
}

export interface Pathway {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  gradientColors: [string, string];
  accentColor: string;
  phases: Phase[];
  totalPrograms: number;
  totalLessons: number;
}

export interface UserPathwayProgress {
  pathwayId: string;
  currentPhaseId: string;
  currentProgramId: string;
  currentLessonId: string;
  currentLessonNumber: number;
  currentLessonTitle: string;
  currentProgramTitle: string;
  currentProgramLessonCount: number;
  completedPrograms: string[];
  completedPhases: string[];
  startedAt: string;
  lastActivityAt: string;
  weeklyLessonCount: number;
  weeklyLessonGoal: number;
  pathwayStreak: number;
  totalHoursLearned: number;
  earnedBadges: string[]; // badge names
}

export interface PathwayScenario {
  id: string;
  label: string;
  ownedPathways: Pathway[];
  progressMap: Record<string, UserPathwayProgress>; // keyed by pathwayId
  activePathwayId: string;
  showCelebration: null | 'program' | 'phase' | 'pathway';
  celebrationPhaseNumber?: number;
}

// ─── Mock Pathway: Manifesting ──────────────────────────────────────────────

const MANIFESTING_PHASES: Phase[] = [
  {
    id: 'mf-foundation',
    name: 'Foundation',
    description: 'Build your manifesting mindset',
    phaseNumber: 1,
    icon: '\u{1F331}', // seedling
    badgeName: 'Foundation Builder',
    programs: [
      { questId: 'silva', title: 'The Silva Ultramind System', author: 'Vishen', image: '/covers/The_Silva_Ultramind_System.jpg', lessonCount: 29, order: 1, isUnlocked: true },
      { questId: 'duality', title: 'Duality', author: 'Jeffrey Allen', image: '/covers/Duality.jpg', lessonCount: 30, order: 2, isUnlocked: true },
      { questId: 'art-manifesting', title: 'The Art of Manifesting', author: 'Regan Hillyer', image: '/covers/The_Art_of_Manifesting.png', lessonCount: 15, order: 3, isUnlocked: true },
      { questId: 'manifesting-mastery', title: 'Manifesting Mastery', author: 'Regan Hillyer', image: '/covers/Manifesting_Mastery.jpg', lessonCount: 20, order: 4, isUnlocked: false },
      { questId: 'money-eq', title: 'Money EQ', author: 'Ken Honda', image: '/covers/Money_EQ.png', lessonCount: 21, order: 5, isUnlocked: false, isMostPopular: true },
      { questId: 'feng-shui', title: 'Feng Shui for Life', author: 'Marie Diamond', image: '/covers/Feng_Shui_for_Life.png', lessonCount: 18, order: 6, isUnlocked: false },
      { questId: 'six-phase', title: 'The 6 Phase Meditation', author: 'Vishen', image: '/covers/The_6_Phase_Meditation.jpg', lessonCount: 20, order: 7, isUnlocked: false },
    ],
  },
  {
    id: 'mf-deepening',
    name: 'Deepening',
    description: 'Deepen your practice and expand your awareness',
    phaseNumber: 2,
    icon: '\u{1F525}', // fire
    badgeName: 'Deep Diver',
    programs: [
      { questId: 'be-extraordinary', title: 'Be Extraordinary', author: 'Vishen', image: '/covers/Be_Extraordinary.jpg', lessonCount: 30, order: 1, isUnlocked: false },
      { questId: 'superbrain', title: 'Superbrain', author: 'Jim Kwik', image: '/covers/Superbrain.png', lessonCount: 34, order: 2, isUnlocked: false },
      { questId: 'lifebook', title: 'Lifebook Online', author: 'Jon & Missy Butcher', image: '/covers/Lifebook.png', lessonCount: 35, order: 3, isUnlocked: false },
      { questId: 'sleep-mastery', title: 'The Mastery of Sleep', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 22, order: 4, isUnlocked: false },
      { questId: 'longevity', title: 'Longevity Blueprint', author: 'Ben Greenfield', image: '/covers/The_Longevity_Blueprint.png', lessonCount: 24, order: 5, isUnlocked: false },
      { questId: 'speak-inspire', title: 'Speak & Inspire', author: 'Lisa Nichols', image: '/covers/Speak_and_Inspire.png', lessonCount: 28, order: 6, isUnlocked: false },
      { questId: 'ten-x-fitness', title: '10x Fitness', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 26, order: 7, isUnlocked: false },
      { questId: 'negotiate', title: 'Negotiate with Confidence', author: 'Kwame Christian', image: '/covers/Negotiate_with_Confidence_Clarity_in_Every_Conversation.jpg', lessonCount: 14, order: 8, isUnlocked: false },
    ],
  },
  {
    id: 'mf-mastery',
    name: 'Mastery',
    description: 'Master advanced manifesting techniques',
    phaseNumber: 3,
    icon: '\u{26A1}', // lightning
    badgeName: 'Master Manifestor',
    programs: [
      { questId: 'conscious-parenting', title: 'Conscious Parenting', author: 'Dr. Shefali', image: '/covers/Conscious_Parenting_Mastery.png', lessonCount: 28, order: 1, isUnlocked: false },
      { questId: 'hypnotherapist', title: 'Certified Hypnotherapist', author: 'Paul McKenna', image: '/covers/Mindvalley_Certified_Hypnotherapist.jpg', lessonCount: 35, order: 2, isUnlocked: false },
      { questId: 'brand', title: 'Building an Unstoppable Brand', author: 'Jeffrey Perlman', image: '/covers/Building_an_Unstoppable_Brand.jpg', lessonCount: 19, order: 3, isUnlocked: false },
      { questId: 'lifebook-mastery', title: 'Lifebook Mastery', author: 'Jon & Missy Butcher', image: '/covers/Lifebook_Mastery.jpg', lessonCount: 30, order: 4, isUnlocked: false },
      { questId: 'getting-started', title: 'Getting Started with Mindvalley', author: 'Vishen', image: '/covers/Getting_Started_with_Mindvalley.jpg', lessonCount: 10, order: 5, isUnlocked: false },
      { questId: 'yogi-guide', title: "A Yogi's Guide to Joy", author: 'Sadhguru', image: '/covers/A_Yogis_Guide_to_Joy.jpg', lessonCount: 15, order: 6, isUnlocked: false },
      { questId: 'wildfit', title: 'WildFit', author: 'Eric Edmeades', image: '/covers/Wildfit.png', lessonCount: 28, order: 7, isUnlocked: false },
      { questId: 'ten-x-fitness-2', title: '10x Fitness Advanced', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 20, order: 8, isUnlocked: false },
    ],
  },
  {
    id: 'mf-integration',
    name: 'Integration',
    description: 'Integrate everything into your daily life',
    phaseNumber: 4,
    icon: '\u{1F31F}', // star
    badgeName: 'Integration Expert',
    programs: [
      { questId: 'int-silva-2', title: 'Silva Ultramind Advanced', author: 'Vishen', image: '/covers/The_Silva_Ultramind_System.jpg', lessonCount: 20, order: 1, isUnlocked: false },
      { questId: 'int-duality-2', title: 'Duality Advanced', author: 'Jeffrey Allen', image: '/covers/Duality.jpg', lessonCount: 22, order: 2, isUnlocked: false },
      { questId: 'int-money-2', title: 'Money EQ Advanced', author: 'Ken Honda', image: '/covers/Money_EQ.png', lessonCount: 18, order: 3, isUnlocked: false },
      { questId: 'int-sleep-2', title: 'Sleep Mastery Advanced', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 16, order: 4, isUnlocked: false },
      { questId: 'int-speak-2', title: 'Speak & Inspire Advanced', author: 'Lisa Nichols', image: '/covers/Speak_and_Inspire.png', lessonCount: 20, order: 5, isUnlocked: false },
      { questId: 'int-lifebook-2', title: 'Lifebook Integration', author: 'Jon & Missy Butcher', image: '/covers/Lifebook.png', lessonCount: 25, order: 6, isUnlocked: false },
      { questId: 'int-extraordinary-2', title: 'Be Extraordinary Advanced', author: 'Vishen', image: '/covers/Be_Extraordinary.jpg', lessonCount: 22, order: 7, isUnlocked: false },
    ],
  },
];

export const MANIFESTING_PATHWAY: Pathway = {
  id: 'manifesting',
  name: 'Manifesting',
  tagline: 'Law of Attraction & Abundance',
  icon: '\u{2728}', // sparkles
  gradientColors: ['#2a1a4e', '#4a2a6e'],
  accentColor: '#7B68EE',
  phases: MANIFESTING_PHASES,
  totalPrograms: 30,
  totalLessons: 450,
};

// Second pathway for multi-pathway testing
const LONGEVITY_PHASES: Phase[] = [
  {
    id: 'lg-foundation',
    name: 'Foundation',
    description: 'Build healthy habits and routines',
    phaseNumber: 1,
    icon: '\u{1F331}',
    badgeName: 'Health Pioneer',
    programs: [
      { questId: 'ten-x-fitness-lg', title: '10x Fitness', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 26, order: 1, isUnlocked: true },
      { questId: 'sleep-lg', title: 'The Mastery of Sleep', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 22, order: 2, isUnlocked: false },
      { questId: 'longevity-lg', title: 'Longevity Blueprint', author: 'Ben Greenfield', image: '/covers/The_Longevity_Blueprint.png', lessonCount: 24, order: 3, isUnlocked: false },
    ],
  },
  {
    id: 'lg-mastery',
    name: 'Mastery',
    description: 'Advanced longevity science',
    phaseNumber: 2,
    icon: '\u{26A1}',
    badgeName: 'Longevity Master',
    programs: [
      { questId: 'wildfit-lg', title: 'WildFit', author: 'Eric Edmeades', image: '/covers/Wildfit.png', lessonCount: 28, order: 1, isUnlocked: false },
      { questId: 'yogi-lg', title: "A Yogi's Guide to Joy", author: 'Sadhguru', image: '/covers/A_Yogis_Guide_to_Joy.jpg', lessonCount: 15, order: 2, isUnlocked: false },
    ],
  },
];

export const LONGEVITY_PATHWAY: Pathway = {
  id: 'longevity',
  name: 'Longevity',
  tagline: 'Health, Fitness & Longevity Science',
  icon: '\u{1F4AA}', // flexed bicep
  gradientColors: ['#0f1a4a', '#1e3a8a'],
  accentColor: '#60a5fa',
  phases: LONGEVITY_PHASES,
  totalPrograms: 5,
  totalLessons: 115,
};

// ─── Scenario Presets ───────────────────────────────────────────────────────

export const PATHWAY_SCENARIOS: PathwayScenario[] = [
  {
    id: 'no-pathway',
    label: 'No Pathway',
    ownedPathways: [],
    progressMap: {},
    activePathwayId: '',
    showCelebration: null,
  },
  {
    id: 'just-started',
    label: 'Just Started',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'silva',
        currentLessonId: 'silva-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'Welcome to Silva Ultramind',
        currentProgramTitle: 'The Silva Ultramind System',
        currentProgramLessonCount: 29,
        completedPrograms: [],
        completedPhases: [],
        startedAt: '2026-03-20T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 0,
        weeklyLessonGoal: 4,
        pathwayStreak: 0,
        totalHoursLearned: 0,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'mid-progress',
    label: 'Mid-Progress (Phase 1)',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l4',
        currentLessonNumber: 4,
        currentLessonTitle: 'The Alpha Level Technique',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 3,
        weeklyLessonGoal: 4,
        pathwayStreak: 5,
        totalHoursLearned: 62,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'phase-1-complete',
    label: 'Phase 1 Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-deepening',
        currentProgramId: 'be-extraordinary',
        currentLessonId: 'be-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'The Extraordinary You',
        currentProgramTitle: 'Be Extraordinary',
        currentProgramLessonCount: 30,
        completedPrograms: ['silva', 'duality', 'art-manifesting', 'manifesting-mastery', 'money-eq', 'feng-shui', 'six-phase'],
        completedPhases: ['mf-foundation'],
        startedAt: '2026-01-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 2,
        weeklyLessonGoal: 4,
        pathwayStreak: 12,
        totalHoursLearned: 105,
        earnedBadges: ['Foundation Builder'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'celebrate-program',
    label: 'Celebrate: Program Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'Introduction to Manifesting',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 7,
        totalHoursLearned: 58,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'program',
  },
  {
    id: 'celebrate-phase',
    label: 'Celebrate: Phase 1 Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'six-phase',
        currentLessonId: 'sp-done',
        currentLessonNumber: 20,
        currentLessonTitle: 'Final Integration',
        currentProgramTitle: 'The 6 Phase Meditation',
        currentProgramLessonCount: 20,
        completedPrograms: ['silva', 'duality', 'art-manifesting', 'manifesting-mastery', 'money-eq', 'feng-shui', 'six-phase'],
        completedPhases: ['mf-foundation'],
        startedAt: '2026-01-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 14,
        totalHoursLearned: 105,
        earnedBadges: ['Foundation Builder'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'phase',
    celebrationPhaseNumber: 1,
  },
  {
    id: 'celebrate-pathway',
    label: 'Celebrate: Pathway Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-integration',
        currentProgramId: 'int-extraordinary-2',
        currentLessonId: 'done',
        currentLessonNumber: 22,
        currentLessonTitle: 'The Extraordinary Life',
        currentProgramTitle: 'Be Extraordinary Advanced',
        currentProgramLessonCount: 22,
        completedPrograms: MANIFESTING_PHASES.flatMap(p => p.programs.map(pr => pr.questId)),
        completedPhases: MANIFESTING_PHASES.map(p => p.id),
        startedAt: '2025-06-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 45,
        totalHoursLearned: 380,
        earnedBadges: ['Foundation Builder', 'Deep Diver', 'Master Manifestor', 'Integration Expert'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'pathway',
  },
  {
    id: 'multi-pathway',
    label: 'Multiple Pathways',
    ownedPathways: [MANIFESTING_PATHWAY, LONGEVITY_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l4',
        currentLessonNumber: 4,
        currentLessonTitle: 'The Alpha Level Technique',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-25T00:00:00Z',
        weeklyLessonCount: 3,
        weeklyLessonGoal: 4,
        pathwayStreak: 5,
        totalHoursLearned: 62,
        earnedBadges: [],
      },
      longevity: {
        pathwayId: 'longevity',
        currentPhaseId: 'lg-foundation',
        currentProgramId: 'ten-x-fitness-lg',
        currentLessonId: 'txf-l8',
        currentLessonNumber: 8,
        currentLessonTitle: 'Upper Body Power',
        currentProgramTitle: '10x Fitness',
        currentProgramLessonCount: 26,
        completedPrograms: [],
        completedPhases: [],
        startedAt: '2026-03-15T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 2,
        weeklyLessonGoal: 4,
        pathwayStreak: 3,
        totalHoursLearned: 8,
        earnedBadges: [],
      },
    },
    activePathwayId: 'longevity', // most recent
    showCelebration: null,
  },
];

// ─── Social proof mock data ─────────────────────────────────────────────────

export const SOCIAL_PROOF = {
  activeLearners: 1247,
  phaseCompletionRate: 73,
  peerPercentile: 27,
  forwardMotivation: 89,
  phaseCompletions: {
    'mf-foundation': 4312,
    'mf-deepening': 2891,
    'mf-mastery': 1204,
    'mf-integration': 687,
    'lg-foundation': 1893,
    'lg-mastery': 742,
  } as Record<string, number>,
  avgWeeksToReach: {
    'mf-deepening': 6,
    'mf-mastery': 14,
    'mf-integration': 24,
    'lg-mastery': 8,
  } as Record<string, number>,
};

export function getPercentile(completedPrograms: number, totalPrograms: number): number {
  if (totalPrograms === 0) return 0;
  const ratio = completedPrograms / totalPrograms;
  // Mock percentile curve: early completers are ahead of more people
  return Math.min(99, Math.round((1 - Math.pow(1 - ratio, 1.5)) * 100));
}

export function getNextMilestonePercentile(currentPercentile: number): number {
  // Next round milestone: 20, 30, 40, ... 90
  const next = Math.ceil((currentPercentile + 1) / 10) * 10;
  return Math.min(90, next);
}

export function getLessonsToNextMilestone(completedPrograms: number, totalPrograms: number): number {
  if (totalPrograms === 0) return 0;
  const currentPercentile = getPercentile(completedPrograms, totalPrograms);
  const target = getNextMilestonePercentile(currentPercentile);
  // Estimate lessons needed by inverting the percentile curve
  const targetRatio = 1 - Math.pow(1 - target / 100, 1 / 1.5);
  const currentRatio = completedPrograms / totalPrograms;
  const remainingRatio = Math.max(0, targetRatio - currentRatio);
  return Math.max(1, Math.ceil(remainingRatio * totalPrograms * 15)); // ~15 lessons per program
}

export const COMPARATIVE_STATS = {
  paceCompletion: 68, // "68% at your stage finish next program within 2 weeks"
  paceWeeks: 2,
  avgLessonsPerWeek: 4.2,
  consistencyRanking: 73, // "More consistent than 73% this month"
};

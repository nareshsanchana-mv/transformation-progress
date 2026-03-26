# Pathways Feature Design

## Problem

Customers with access to 110+ Mindvalley programs report not knowing where to start or what to do next. This leads to decision paralysis, low engagement, and poor retention.

## Solution

**Pathways** — curated collections of 20-30 programs sold as a themed bundle. Each Pathway provides a specific order to follow, organized into phases, with gamification elements that drive consistency and a sense of progress.

## Core Decisions

- **Phase structure:** 3-5 large phases per Pathway (e.g., Foundation, Deepening, Mastery, Integration), fully curated by the editorial team
- **Multiple ownership:** Users can own multiple Pathways simultaneously; most recently active one is shown by default
- **Architecture:** Layered approach — compact action-forward card on Today page + full Pathway Detail Screen one tap away
- **Social proof:** Combination of aggregate stats, live activity signals, and peer comparison, placed contextually
- **Sequential unlocking:** Programs unlock in order within a phase; phases unlock sequentially

---

## Data Model

### Pathway (editorial, curated)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | e.g., "Manifesting" |
| `tagline` | string | e.g., "Law of Attraction & Abundance" |
| `icon` | string | Emoji or icon reference |
| `gradientColors` | string[] | Brand gradient for the Pathway |
| `accentColor` | string | Primary accent color |
| `phases` | Phase[] | Ordered array of 3-5 phases |
| `totalPrograms` | number | Precomputed count |
| `totalLessons` | number | Precomputed count |
| `pricingSingle` | string | Single program price |
| `pricingCollection` | string | Collection price |
| `pricingAllAccess` | string | All-access price |

### Phase

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | e.g., "Foundation" |
| `description` | string | e.g., "Build your manifesting mindset" |
| `phaseNumber` | number | Position in Pathway (1-based) |
| `icon` | string | Phase-specific icon (e.g., seedling, flame) |
| `programs` | PathwayProgram[] | Ordered array of programs |

### PathwayProgram

| Field | Type | Description |
|-------|------|-------------|
| `questId` | string | Reference to existing Quest |
| `order` | number | Position within the phase |
| `isUnlocked` | boolean | Whether user can start this program |

### UserPathwayProgress (per user, per Pathway)

| Field | Type | Description |
|-------|------|-------------|
| `pathwayId` | string | Which Pathway |
| `currentPhaseId` | string | Active phase |
| `currentProgramId` | string | Active program |
| `currentLessonId` | string | Next lesson to play |
| `completedPrograms` | string[] | IDs of finished programs |
| `completedPhases` | string[] | IDs of finished phases |
| `startedAt` | string | ISO date |
| `lastActivityAt` | string | ISO date |
| `weeklyLessonCount` | number | Lessons completed this week (resets Monday) |
| `pathwayStreak` | number | Consecutive days active on this Pathway |

The existing Quest/QuestWeek/QuestLesson structure remains unchanged. Pathways wrap and sequence existing Quests.

---

## UI Design

### 1. My Pathway Card (Today Screen)

**Placement:** First section after greeting, above all other sections. Most prominent element on the page.

**Layout: Action-Forward Card**
- **Header row:** Pathway icon + name + "Switch" affordance (top-right, for multi-Pathway users)
- **Hero block:** Gradient background containing:
  - "UP NEXT" label
  - Lesson title, program name, lesson number, duration
  - Bold "Continue" button with play icon
- **Bottom compact row:** Phase name + progress fraction (e.g., "Foundation 2/7") with mini progress bar on the left; streak count and weekly goal count on the right

**Pathway switcher behavior:** When user owns multiple Pathways, tapping "Switch" shows the other owned Pathways. The card always defaults to the most recently active Pathway.

**Deduplication:** Programs that appear in the active Pathway are excluded from the existing "Continue Programs" section to avoid duplication.

### 2. Pathway Detail Screen

**Access:** Tap the My Pathway card on Today, or from the Progress screen's Pathways section.

**Header Section:**
- Back button + overflow menu
- Pathway icon + name + program/lesson counts
- Overall progress bar with percentage and program count
- Stats row: streak, weekly goal, total hours learned, badges earned
- Social proof bar: avatar stack + active learner count + phase completion rate

**Body: Vertical Timeline**
- Current phase is expanded, showing all programs in a vertical list with a timeline rail on the left
- Each program shows one of three states:
  - **Completed:** Teal checkmark on timeline, program card at reduced opacity with "Completed" label
  - **Current:** Purple glowing dot on timeline, highlighted card border, lesson progress bar, play icon on thumbnail
  - **Locked:** Empty dot on timeline, lock icon on thumbnail, reduced opacity, "Unlocks next" label
- If more than 5 programs in the expanded phase, show first 5 + "+N more" expander
- Completed phases shown as collapsed cards above the current phase, tappable to expand and review completed programs
- Future phases shown as collapsed cards below the current phase, progressively more faded, with lock icon and "Unlocks after Phase N" label

**Navigation from programs:** Tapping a completed or current program navigates to QuestDetailScreen with Pathway context.

### 3. Milestone Celebrations

**Style: Celebratory & Energetic** — bold typography, confetti sparkle elements, warm gold/coral gradients.

**Three tiers:**

#### Program Complete (inline)
- Smaller celebration that appears after the last lesson of a program
- Confetti animation, program completion stats
- "Next: [Program Name]" CTA to continue the Pathway

#### Phase Complete (full-screen modal)
- Bold "PHASE N COMPLETE!" header with gradient text
- Phase badge earned callout card (gold border, trophy icon, badge name)
- Stats: programs completed, lessons completed, hours invested
- Dual social proof: peer comparison ("Top 27%") + forward-looking motivation ("89% who reach Phase 2 finish the Pathway")
- Primary CTA: "Unlock Phase N: [Phase Name]" with gold/coral gradient button
- Secondary: "Share your achievement" link

#### Pathway Complete (full-screen modal, grand finale)
- All earned phase badges displayed
- Total journey stats (all programs, lessons, hours)
- "Pathway Complete" special badge
- Share prompt
- CTA to explore other Pathways

### 4. Gamification System

#### Phase Completion Badges
- Each phase earns a unique badge (e.g., Foundation Builder, Deep Diver, Master Manifestor, Integration Expert)
- Displayed on: celebration screen, Pathway Detail header, Progress screen Achievements tab
- Completing entire Pathway earns a special "Pathway Complete" badge

#### Streak Integration
- Per-Pathway streak displayed on My Pathway card and Pathway Detail screen
- Resets after 48 hours of inactivity on that Pathway (allows one day off)

#### Weekly Lesson Goal
- Compact "N/4 this week" counter on card and detail screen
- Default goal: 4 lessons per week
- Resets every Monday

#### Social Proof Nudges (contextual placement)
- **Today card:** Active learner count (e.g., "1,247 active learners")
- **Detail screen social bar:** Active learners + phase completion rate
- **Celebration screens:** Peer comparison + forward-looking completion stat
- **Locked programs:** "Most popular program in this phase" label on one program per phase

---

## Navigation & Integration

### New Screens
- `PathwayDetailScreen` — added to root stack navigator
- Celebration modals — overlay on current screen

### Existing Screen Changes

**TodayScreen:**
- Insert My Pathway card as first section after greeting
- Exclude active Pathway programs from "Continue Programs" section

**ProgressScreen:**
- Add "Pathways" section above existing stats grid
- Shows owned Pathways with completion percentage and earned badges

**QuestDetailScreen:**
- When accessed from Pathway context: show breadcrumb ("Manifesting Pathway > Foundation > Silva Ultramind")
- After last lesson of a program: show "Next in Pathway" button instead of generic completion

**ProgramsScreen:** No changes.

### Data Flow
- Pathway definitions and user progress stored in mockData (same pattern as existing data)
- Lesson completion cascades: lesson complete → check program complete → check phase complete → check Pathway complete
- "Next lesson" logic reads from Pathway's curated order
- Celebration modals trigger at each cascade level when a completion threshold is crossed

---

## Scope Boundaries

**In scope:**
- Pathway data model and mock data for Manifesting Pathway (30 programs across 4 phases)
- My Pathway card on Today screen with switcher
- Pathway Detail screen with vertical timeline
- Three tiers of milestone celebrations
- Phase badges integrated into Progress screen
- Streak, weekly goal, and social proof displays
- Breadcrumb and "Next in Pathway" on QuestDetailScreen

**Out of scope:**
- Pathway purchase/pricing flow
- Backend API integration (mock data only)
- Pathway browsing/discovery screen
- Notifications or push reminders
- Leaderboards
- Adjustable weekly goals
- Share functionality implementation (UI only, no actual sharing)

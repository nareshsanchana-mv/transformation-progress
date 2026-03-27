# Transformation Journey Map Design

## Problem

The Profile screen currently shows generic stats (streak, lessons completed, meditated minutes) that don't connect to the user's Pathway journey. Users lack a visual, motivating overview of their full transformation progression.

## Solution

Replace the Profile screen's progress section and Growth Goals section with a **Transformation Journey Map** — horizontally scrollable path cards, one per owned Pathway, showing the user's position across phases with social proof at each waypoint.

## Core Decisions

- **Visual metaphor:** Horizontal scrollable path with phase waypoints (left-to-right), distinct from the vertical timeline on PathwayDetailScreen
- **Multiple Pathways:** Stacked vertically, one card per owned Pathway, all visible at once
- **Social proof:** Combination of comparative position ("ahead of 68%"), community milestones ("4,312 completed this phase"), and timing benchmarks ("avg. 6 weeks to reach")
- **Interaction:** Tapping a waypoint navigates to PathwayDetailScreen for that phase

---

## Profile Screen Changes

### Removed
- Streak card, stat cards (lessons completed, meditated minutes), achievements grid
- Growth Goals section

### New Layout Order
1. Profile header (existing — avatar, name, email, edit button)
2. **"My Transformation" section** — stacked JourneyMapCards
3. Library section (existing — Continue, Favorites, Completed, Downloads)

### Empty State
When the user has no Pathways, show a motivational placeholder: "Start your transformation journey" with a brief description. Replaces the old zeroed-out stats.

---

## JourneyMapCard Component

One card per owned Pathway, full-width, stacked vertically.

### Card Header
- Left: Pathway icon + name + tagline
- Right: Overall completion — "12% · 4/30 programs"

### Horizontal Path (scrollable)
- A winding dashed path line connecting phase waypoints left to right
- Auto-scrolls to center the user's current position on appear

**Waypoints** (one per phase, circles along the path):

| State | Visual | Icon | Label Below | Social Proof |
|-------|--------|------|-------------|-------------|
| Completed | Filled teal circle | Checkmark | Badge name (e.g., "Foundation Builder") | "{N} completed this phase" |
| Current | Larger circle, glowing with Pathway accent color | Phase icon | "YOU ARE HERE" | "Ahead of {X}% of learners" |
| Locked | Outlined/dimmed circle | Lock icon | Phase name | First locked only: "Avg. {N} weeks to reach" |

**Program dots** between waypoints:
- Small dots along the path between adjacent waypoints representing individual programs
- Filled dot = completed program, empty dot = remaining
- Non-interactive — purely visual density/progress indicators

### Card Footer
- Compact stats row: streak count, weekly goal progress (N/4), total hours learned

### Card Styling
- Uses Pathway's `gradientColors` as a subtle background tint
- Each Pathway visually distinct when stacked

### Journey Complete State
- When all phases are completed: gradient overlay across the card with "Journey Complete" label
- Shows total journey stats: programs completed, lessons completed, hours invested

---

## Waypoint Interaction

- **Completed waypoint tap:** Navigate to PathwayDetailScreen, scrolled to that phase
- **Current waypoint tap:** Navigate to PathwayDetailScreen, focused on current phase
- **Locked waypoint tap:** Subtle shake/bounce animation, no navigation

Navigation uses existing `PathwayDetail` route with `pathwayId` param. The PathwayDetailScreen already shows the expanded phase view.

---

## Data Model

### No New Types Required
- Pathway definitions come from existing `Pathway` / `Phase` types
- User progress comes from existing `UserPathwayProgress` via `PathwayContext`

### Extended Social Proof Data
Add to `SOCIAL_PROOF` in `src/data/pathwayData.ts`:

| Field | Type | Description |
|-------|------|-------------|
| `phaseCompletions` | `Record<string, number>` | Number of users who completed each phase, keyed by phase ID |
| `avgWeeksToReach` | `Record<string, number>` | Average weeks to reach each phase (excluding first), keyed by phase ID |

Percentile calculation: derived from `completedPrograms.length / totalPrograms`, mapped to a percentile curve (mock implementation).

### Social Proof Placement
- **Completed waypoint:** "{N} completed this phase" (from `phaseCompletions`)
- **Current waypoint:** "Ahead of {X}% of learners" (from percentile calculation)
- **First locked waypoint only:** "Avg. {N} weeks to reach" (from `avgWeeksToReach`)
- **Subsequent locked waypoints:** No social proof (keeps it clean)

---

## Visual States

| Scenario | Journey Map Behavior |
|----------|---------------------|
| No Pathway | Empty state placeholder: "Start your transformation journey" |
| Just Started | Single card, first waypoint current (glowing), all others locked, 0% |
| Mid-Progress | Single card, first waypoint completed, second current, rest locked, program dots partially filled |
| Phase 1 Complete | First waypoint completed with badge + community stat, second current, rest locked |
| Celebrate scenarios | Same as base state — celebrations are modals handled elsewhere |
| Pathway Complete | All waypoints completed, "Journey Complete" banner with total stats |
| Multiple Pathways | Two stacked cards — Manifesting and Longevity — each showing respective progress |

All states accessible via the existing Header scenario selector.

---

## New Files
| File | Responsibility |
|------|---------------|
| `src/components/JourneyMapCard.tsx` | Full journey map card for a single Pathway |
| `src/components/JourneyWaypoint.tsx` | Individual phase waypoint (completed/current/locked) |

## Modified Files
| File | Change |
|------|--------|
| `src/screens/ProfileScreen.tsx` | Remove progress section + Growth Goals, add My Transformation section with JourneyMapCards |
| `src/data/pathwayData.ts` | Extend SOCIAL_PROOF with phaseCompletions and avgWeeksToReach |

---

## Scope Boundaries

**In scope:**
- JourneyMapCard component with horizontal scrollable path
- JourneyWaypoint component with three states
- Profile screen replacement of progress + Growth Goals sections
- Extended social proof mock data
- Empty state for no Pathways
- Journey Complete state
- Waypoint tap navigation to PathwayDetailScreen

**Out of scope:**
- Animated path drawing/trail effects
- Path customization or themes
- Sharing journey progress
- Backend API integration (mock data only)
- Changes to PathwayDetailScreen scroll position (taps navigate there but we don't implement scroll-to-phase)

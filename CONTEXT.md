# GeoWordle — Project Context

Hackathon: SASEHacks 2026 | Track: Gamification (+ Service)

## The Idea

Wordle, but you guess a US state based on statistical clues that update with every guess. The mechanic is immediately graspable — hand someone the keyboard and they're hooked in 30 seconds.

Direct inspiration: Wardle (wardlegame.com) — a Wordle clone for War Thunder vehicles. We borrow the idea of rich per-cell feedback and point it at geography, but tune the numeric hints for clearer play: exact matches are green, near misses stay amber, and arrows always show which direction to move next.

## Current State

Core game loop is fully implemented and working:
- Daily puzzle seeded by date (same state for all players each day)
- Endless mode: after winning the daily, play unlimited random states with a round counter; no state repeats within a session
- 50 US states with validated attribute data
- Directional numeric feedback on 8 columns per guess, with amber for near misses
- Mode badge in header (blue = Daily, purple = Endless · Round N)

## Tech Stack

- **Framework**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4
- **Data**: Static JSON (`src/data/states.json`) — no database

## Project Structure

```
src/
  app/
    page.tsx          # Main UI — header badge, guess table, win CTA
    layout.tsx
  hooks/
    useGame.ts        # All game state: mode, round, guesses, target, submitGuess, switchToEndless, nextRound
  lib/
    gameLogic.ts      # compareGuess(), CellState types, State/GuessResult interfaces
    dailySeed.ts      # getTodaysState() (date-seeded), getRandomState(excludeNames)
  data/
    states.json       # 50 states, 8 attributes each
```

## Attribute Columns

| Column | Type | Notes |
|---|---|---|
| region | categorical | Northeast, South, Midwest, West |
| population | numeric | ±20% threshold for amber "close"; arrows still show direction |
| area | numeric | sq miles, ±20% threshold for amber "close"; arrows still show direction |
| gdpPerCapita | numeric | ±15% threshold for amber "close"; arrows still show direction |
| coastline | categorical | None / Atlantic / Pacific / Gulf / Great Lakes — partial if both have *any* coast |
| medianAge | numeric | ±3 years threshold for amber "close"; arrows still show direction |
| yearOfStatehood | numeric | ±20 years threshold for amber "close"; arrows still show direction |
| landlocked | boolean | — |

## Color System

| Color | State | Meaning |
|---|---|---|
| Green | correct | Exact match |
| Red | incorrect | Categorically wrong |
| Yellow | partial | Adjacent/related (e.g. both have coastline but different type) |
| Orange + arrow | close | Numeric, within threshold, with direction shown |
| Red + arrow | incorrect | Numeric, outside threshold, with direction shown |

## Game Modes

**Daily**: One state per day, same for all players. Seeded from days since 2026-01-01.

**Endless**: Unlocked after winning the daily. Picks random states from remaining unplayed pool (no repeats in session). Auto-resets to full pool when all 50 exhausted. Round counter displayed in header badge.

## Planned / Not Yet Built

- Countries mode (195 countries, difficulty tiers by GDP/population)
- Share button (emoji grid, no spoilers)
- Player count display ("N people solved today's state")
- Any backend / persistence (currently all client-side)

## Why This Wins Gamification Track

The prompt: "Transform a mundane task into an engaging experience through gamification." The mundane task is geographic/demographic literacy. The transformation is a daily puzzle with color-coded feedback and a satisfying win condition. Secondary Service track claim ("helps people learn") costs nothing extra.

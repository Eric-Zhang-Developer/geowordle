<!-- Badges -->
<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
</p>

<p align="center">
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" /></a>
</p>

---

<h1 align="center">Statle</h1>

<p align="center">
  <strong>Wordle, but make it geography.</strong>
</p>

<p align="center">
  A daily US state guessing game with color-coded statistical feedback — think Wordle meets a road atlas.
  <br />
  Built at <strong>SASEHacks 2026</strong>.
</p>

<p align="center">
  <a href="https://geodlegame.vercel.app"><img src="https://img.shields.io/badge/-🗺️%20Play%20Now!-brightgreen?style=for-the-badge" alt="Play Now" /></a>
</p>

<!-- TODO: Add screenshot or demo GIF here -->
<!-- <p align="center">
  <img src="./demo.gif" alt="Statle Demo" width="600" />
</p> -->

## Overview

**Statle** challenges you to guess today's mystery US state using statistical clues that update with every guess.

Each guess reveals color-coded feedback across 8 attributes — region, population, area, population density, electoral votes, GDP per capita, coastline, and year of statehood. Green means exact match, amber means close, red means wrong — with arrows telling you which direction to move for numeric clues. Hand someone the keyboard and they're hooked in 30 seconds.

The game features a retro Americana aesthetic — warm parchment tones, vintage road-sign typography, and that nostalgic roadside-attraction energy.

## How It Works

1. **Guess a State** — Type any US state name into the search bar and submit.
2. **Read the Clues** — Each of the 8 attribute cells reveals its color: green (correct), amber (close), or red (wrong). Numeric cells include arrows showing whether the true value is higher or lower.
3. **Narrow It Down** — Use the directional hints to zero in on the answer.
4. **Win the Round** — Guess correctly to trigger the victory reveal, confetti, and a recap map showing every state you guessed.
5. **Keep Going** — After the daily puzzle, switch to Endless Mode for unlimited rounds with no repeats.

## Key Features

- **Daily Puzzle** — One state per day, same for all players, seeded by date.
- **Endless Mode** — Unlocked after winning the daily. Random states from the full pool, no repeats per session, with a round counter.
- **8-Column Feedback** — Directional arrows on all numeric clues; partial credit for related categorical values.
- **Staggered Reveal Animation** — Cells flip open one by one after each guess for that satisfying Wordle-style reveal.
- **Recap Map** — Post-win US map highlighting every state you guessed: green for correct, red for wrong.
- **Share Button** — Copy an emoji grid of your run to share without spoilers.
- **Retro Americana UI** — Parchment background, vintage typography (Rye + Special Elite), warm earth-tone color palette.
- **Fully Client-Side** — No backend, no database, no login. Just the game.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — Type-safe development
- **Tailwind CSS v4** — Utility-first styling with custom `@theme` animations
- **react-usa-map** — SVG US map for the post-win recap
- **react-confetti** — Victory confetti
- **Rye + Special Elite** — Google Fonts for the retro Americana typography

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Eric-Zhang-Developer/geowordle.git
   cd geowordle
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Attribute Columns

| Column            | Type        | Close Threshold            |
| ----------------- | ----------- | -------------------------- |
| Region            | Categorical | —                          |
| Population        | Numeric     | ±20%                       |
| Area (mi²)        | Numeric     | ±20%                       |
| Density           | Numeric     | ±20%                       |
| Electoral Votes   | Numeric     | `max(2, ceil(20%))`        |
| GDP / Capita      | Numeric     | ±15%                       |
| Coastline         | Categorical | Exact match                |
| Year of Statehood | Numeric     | ±20 years                  |

## Team

Built with passion at **SASEHacks 2026** by:

- **Eric Zhang** — [GitHub](https://github.com/Eric-Zhang-Developer)
- **Johan Diaz** — [GitHub](https://github.com/JDiaz824)

## Credits

- **[Rye](https://fonts.google.com/specimen/Rye)** — Western display font via Google Fonts
- **[Special Elite](https://fonts.google.com/specimen/Special+Elite)** — Typewriter-style font via Google Fonts
- **[react-usa-map](https://www.npmjs.com/package/react-usa-map)** — SVG US map component
- **[Wordle](https://www.nytimes.com/games/wordle/index.html)** — Original daily word game concept (NYT)
- **Claude Code** — Anthropic's agentic coding tool

---

<p align="center">
  Made with grit and geography at SASEHacks 2026
</p>

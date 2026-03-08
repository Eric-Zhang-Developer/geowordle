"use client";
import USAMap from "react-usa-map";
import { GuessResult } from "../lib/gameLogic";
import { STATE_ABBREVIATIONS } from "../lib/stateAbbreviations";

export function RecapMap({ guesses }: { guesses: GuessResult[] }) {
  const customize: Record<string, { fill: string }> = {};

  guesses.forEach((g) => {
    const abbr = STATE_ABBREVIATIONS[g.state.name];
    if (!abbr) return;
    customize[abbr] = { fill: g.isWin ? "#15803d" : "#991b1b" };
  });

  return (
    <div className="w-full max-w-2xl mt-4">
      <p className="text-sm text-gray-400 text-center mb-1">Your guesses</p>
      <USAMap customize={customize} defaultFill="#374151" />
    </div>
  );
}

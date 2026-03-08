"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/useGame";
import { GuessTable } from "../components/GuessTable";
import { RecapMap } from "../components/RecapMap";
import { StateSearch } from "../components/StateSearch";

const VICTORY_REVEAL_DELAY_MS = 2500;

export default function Home() {
  const {
    mode,
    round,
    guesses,
    selected,
    setSelected,
    submitGuess,
    isWon,
    remaining,
    switchToEndless,
    nextRound,
  } = useGame();

  const [isVictoryRevealed, setIsVictoryRevealed] = useState(false);
  const recapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isWon) return;

    const timer = window.setTimeout(() => setIsVictoryRevealed(true), VICTORY_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isWon]);

  useEffect(() => {
    if (!isVictoryRevealed) return;
    recapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isVictoryRevealed]);

  function handleSwitchToEndless() {
    setIsVictoryRevealed(false);
    switchToEndless();
  }

  function handleNextRound() {
    setIsVictoryRevealed(false);
    nextRound();
  }

  return (
    <main className="p-8 font-mono flex flex-col items-center">
      <div className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-3xl font-bold">Geodle</h1>
        {mode === "daily" ? (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-900 text-blue-300 border border-blue-700">
            Daily
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-900 text-purple-300 border border-purple-700">
            Endless · Round {round}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mb-6 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-700" />
          Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-700" />
          Wrong
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />
          Close
        </span>
        <span className="text-gray-500">▲▼ = too low / too high</span>
      </div>

      {isWon ? (
        isVictoryRevealed ? (
          <div className="space-y-3 mb-6">
            <p className="text-green-400 text-xl font-bold">
              Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
            </p>
            {mode === "daily" ? (
              <button
                onClick={handleSwitchToEndless}
                className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
              >
                Try Endless Mode
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
              >
                Next Round
              </button>
            )}
          </div>
        ) : null
      ) : (
        <StateSearch
          value={selected}
          remaining={remaining}
          onChange={setSelected}
          onSubmit={submitGuess}
        />
      )}
      <GuessTable guesses={guesses} />
      {isWon && isVictoryRevealed && (
        <div ref={recapRef}>
          <RecapMap guesses={guesses} />
        </div>
      )}
    </main>
  );
}

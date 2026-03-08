"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/useGame";
import { GuessTable } from "../components/GuessTable";
import { RecapMap } from "../components/RecapMap";
import { StateSearch } from "../components/StateSearch";
import { VictoryConfetti } from "../components/VictoryConfetti";

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
    <main className="w-full overflow-x-hidden px-3 py-6 font-mono sm:px-8 sm:py-8">
      <VictoryConfetti active={isVictoryRevealed} />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-2">
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
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-gray-400">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-700" />
          Correct
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-700" />
          Wrong
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />
          Close
        </span>
        <span className="text-center text-gray-500">▲▼ = too low / too high</span>
      </div>

      {isWon ? (
        isVictoryRevealed ? (
          <div className="mb-6 space-y-3 text-center">
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
      </div>
    </main>
  );
}

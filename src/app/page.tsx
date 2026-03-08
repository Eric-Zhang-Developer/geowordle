"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/useGame";
import { GuessResult } from "../lib/gameLogic";
import { GuessTable } from "../components/GuessTable";
import { RecapMap } from "../components/RecapMap";
import { StateSearch } from "../components/StateSearch";
import { VictoryConfetti } from "../components/VictoryConfetti";

const SHARE_KEYS = ['region', 'population', 'area', 'gdpPerCapita', 'coastline', 'medianAge', 'yearOfStatehood', 'landlocked'] as const;
const EMOJI: Record<string, string> = { correct: '🟩', close: '🟨', incorrect: '🟥' };

function generateShareString(guesses: GuessResult[], mode: string, round: number): string {
  const header = mode === 'daily'
    ? `Geodle (Daily) - ${guesses.length} Guesses`
    : `Geodle (Endless R${round}) - ${guesses.length} Guesses`;
  const rows = guesses.map(g => SHARE_KEYS.map(k => EMOJI[g.cells[k].state]).join('')).join('\n');
  return `${header}\n\n${rows}`;
}

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
  const [copied, setCopied] = useState(false);
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

  function handleShare() {
    navigator.clipboard.writeText(generateShareString(guesses, mode, round));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="w-full overflow-x-hidden px-3 py-6 sm:px-8 sm:py-8">
      <VictoryConfetti active={isVictoryRevealed} />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="font-rye text-4xl tracking-wide text-stone-900">Geodle</h1>
        {mode === "daily" ? (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-900/80 text-amber-100 border border-stone-700">
            Daily
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-900/80 text-purple-200 border border-stone-700">
            Endless · Round {round}
          </span>
        )}
        </div>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-stone-900">
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
        <span className="text-center text-stone-700">▲▼ = too low / too high</span>
      </div>

      {isWon ? (
        isVictoryRevealed ? (
          <div className="mb-6 space-y-3 text-center">
            <p className="text-green-700 text-xl font-bold">
              Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
            </p>
            <div className="flex justify-center gap-3">
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
              <button
                onClick={handleShare}
                className="px-5 py-2 text-base bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
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
      <div className="bg-stone-900/70 backdrop-blur-sm rounded-2xl p-3">
        <GuessTable guesses={guesses} />
      </div>
      {isWon && isVictoryRevealed && (
        <div ref={recapRef}>
          <RecapMap guesses={guesses} />
        </div>
      )}
      </div>
    </main>
  );
}

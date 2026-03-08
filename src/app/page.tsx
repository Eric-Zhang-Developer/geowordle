"use client";

import { useGame } from "../hooks/useGame";
import { GuessTable } from "../components/GuessTable";

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

  return (
    <main className="p-8 font-mono flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold">GeoWordle</h1>
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
        <span className="text-gray-500">Red + ▲▼ = too low / too high</span>
      </div>

      {isWon ? (
        <div className="space-y-3 mb-6">
          <p className="text-green-400 text-xl font-bold">
            Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
          </p>
          {mode === "daily" ? (
            <button
              onClick={switchToEndless}
              className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
            >
              Try Endless Mode
            </button>
          ) : (
            <button
              onClick={nextRound}
              className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
            >
              Next Round
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2 mb-6">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="px-3 py-2 text-base bg-gray-800 text-white border border-gray-600 rounded"
          >
            <option value="">— pick a state —</option>
            {remaining.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={submitGuess}
            className="px-5 py-2 text-base bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
          >
            Guess
          </button>
        </div>
      )}

      <GuessTable guesses={guesses} />
    </main>
  );
}

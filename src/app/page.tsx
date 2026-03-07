"use client";

import { useGame } from "../hooks/useGame";
import { GuessTable } from "../components/GuessTable";

export default function Home() {
  const { mode, round, guesses, selected, setSelected, submitGuess, isWon, remaining, switchToEndless, nextRound } = useGame();

  return (
    <main className="p-8 font-mono">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold">GeoWordle</h1>
        {mode === 'daily' ? (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-300">
            Daily
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-300">
            Endless · Round {round}
          </span>
        )}
      </div>
      <p className="mb-6 text-gray-500 text-sm">
        Guess the US state. Colors: green=correct, red=wrong, orange=close, yellow=partial,
        red+arrow=direction.
      </p>

      {isWon ? (
        <div className="space-y-3 mb-6">
          <p className="text-green-600 text-xl font-bold">
            Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
          </p>
          {mode === 'daily' ? (
            <button onClick={switchToEndless} className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600">
              Try Endless Mode
            </button>
          ) : (
            <button onClick={nextRound} className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600">
              Next Round
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2 mb-6">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="px-3 py-2 text-base border border-gray-300 rounded"
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

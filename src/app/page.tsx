"use client";

import { useGame } from "../hooks/useGame";
import { CellState, State } from "../lib/gameLogic";

const COLUMNS = [
  "region",
  "population",
  "area",
  "gdpPerCapita",
  "coastline",
  "medianAge",
  "yearOfStatehood",
  "landlocked",
] as const;

type Column = (typeof COLUMNS)[number];

const BG: Record<CellState, string> = {
  correct: "bg-green-600",
  incorrect: "bg-red-600",
  partial: "bg-yellow-600",
  close: "bg-orange-500",
  higher: "bg-red-600",
  lower: "bg-red-600",
};

const INDICATOR: Partial<Record<CellState, string>> = {
  higher: " ▲",
  lower: " ▼",
  close: " ≈",
  partial: " ~",
};

function fmt(col: Column, s: State): string {
  switch (col) {
    case "population":
      return s.population >= 1e6
        ? `${(s.population / 1e6).toFixed(1)}M`
        : `${(s.population / 1e3).toFixed(0)}K`;
    case "area":
      return s.area.toLocaleString();
    case "gdpPerCapita":
      return `$${(s.gdpPerCapita / 1000).toFixed(0)}K`;
    case "medianAge":
      return `${s.medianAge}`;
    case "yearOfStatehood":
      return `${s.yearOfStatehood}`;
    case "region":
      return s.region;
    case "coastline":
      return s.coastline;
    case "landlocked":
      return s.landlocked ? "Yes" : "No";
  }
}

export default function Home() {
  const { guesses, selected, setSelected, submitGuess, isWon, remaining } = useGame();

  return (
    <main className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-1">GeoWordle</h1>
      <p className="mb-6 text-gray-500 text-sm">
        Guess the US state. Colors: green=correct, red=wrong, orange=close, yellow=partial,
        red+arrow=direction.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-400 px-3 py-1.5 bg-gray-200 text-xs text-left whitespace-nowrap">
                State
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c}
                  className="border border-gray-400 px-3 py-1.5 bg-gray-200 text-xs text-left whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => (
              <tr key={i}>
                <td className="border border-gray-400 px-3 py-1.5 text-sm font-bold">
                  {g.state.name}
                </td>
                {COLUMNS.map((c) => {
                  const state = g.cells[c];
                  return (
                    <td
                      key={c}
                      className={`border border-gray-400 px-3 py-1.5 text-sm text-white min-w-20 ${BG[state]}`}
                    >
                      {fmt(c, g.state)}
                      {INDICATOR[state] ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isWon ? (
        <p className="text-green-600 text-xl font-bold">
          Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
        </p>
      ) : (
        <div className="flex gap-2">
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
    </main>
  );
}

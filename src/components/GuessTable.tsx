import { CellDirection, CellState, GuessResult, State } from "../lib/gameLogic";
import { GuessRow } from "./GuessRow";

type Column = keyof Omit<State, "name">;

interface ColumnDef {
  key: Column;
  label: string;
  fmt: (s: State) => string;
}

const COLUMNS: ColumnDef[] = [
  { key: "region", label: "Region", fmt: (s) => s.region },
  {
    key: "population",
    label: "Population",
    fmt: (s) =>
      s.population >= 1e6
        ? `${(s.population / 1e6).toFixed(1)}M`
        : `${(s.population / 1e3).toFixed(0)}K`,
  },
  { key: "area", label: "Area (mi²)", fmt: (s) => s.area.toLocaleString() },
  {
    key: "gdpPerCapita",
    label: "GDP / Capita",
    fmt: (s) => `$${(s.gdpPerCapita / 1000).toFixed(0)}K`,
  },
  { key: "coastline", label: "Coastline", fmt: (s) => s.coastline },
  { key: "medianAge", label: "Median Age", fmt: (s) => `${s.medianAge}` },
  { key: "yearOfStatehood", label: "Year of Statehood", fmt: (s) => `${s.yearOfStatehood}` },
  { key: "landlocked", label: "Landlocked", fmt: (s) => (s.landlocked ? "Yes" : "No") },
];

const BG: Record<CellState, string> = {
  correct: "bg-green-700",
  incorrect: "bg-red-700",
  close: "bg-amber-500",
};

const INDICATOR: Record<CellDirection, string> = {
  higher: " ▲",
  lower: " ▼",
};

export function GuessTable({ guesses }: { guesses: GuessResult[] }) {
  return (
    <div className="mb-10 w-full max-w-full">
      <p className="mb-2 pr-1 text-right text-[11px] text-stone-500 sm:hidden">
        Swipe to view all clues
      </p>
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain pb-2">
        <table className="min-w-max border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="min-w-[132px] rounded bg-stone-700 px-2 py-2 text-center text-[10px] font-semibold whitespace-nowrap text-amber-50 sm:min-w-[180px] sm:py-3 sm:text-xs">
                State
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="w-[88px] rounded bg-stone-700 px-1 py-2 text-center text-[10px] font-semibold whitespace-nowrap text-amber-50 sm:w-24 sm:py-3 sm:text-xs"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => (
              <GuessRow
                key={i}
                guess={g}
                isNew={i === guesses.length - 1}
                columns={COLUMNS}
                bg={BG}
                indicator={INDICATOR}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

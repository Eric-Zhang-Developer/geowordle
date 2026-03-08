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
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="bg-gray-800 text-white text-xs font-semibold py-3 text-center whitespace-nowrap w-28 rounded">
              State
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="bg-gray-800 text-white text-xs font-semibold py-3 text-center whitespace-nowrap w-24 rounded"
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
  );
}

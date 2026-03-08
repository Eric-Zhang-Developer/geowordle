import { CellDirection, CellState, getPopulationDensity, GuessResult, State } from "../lib/gameLogic";
import { GuessRow, PlaceholderGuessRow } from "./GuessRow";

type Column =
  | "region"
  | "population"
  | "area"
  | "density"
  | "electoralVotes"
  | "gdpPerCapita"
  | "coastline"
  | "yearOfStatehood";

interface ColumnDef {
  key: Column;
  labelLines: string[];
  fmt: (s: State) => string;
}

const COLUMNS: ColumnDef[] = [
  { key: "region", labelLines: ["Region"], fmt: (s) => s.region },
  {
    key: "population",
    labelLines: ["Population"],
    fmt: (s) =>
      s.population >= 1e6
        ? `${(s.population / 1e6).toFixed(1)}M`
        : `${(s.population / 1e3).toFixed(0)}K`,
  },
  { key: "area", labelLines: ["Area (mi²)"], fmt: (s) => s.area.toLocaleString() },
  {
    key: "density",
    labelLines: ["Density"],
    fmt: (s) => `${Math.round(getPopulationDensity(s)).toLocaleString()}/mi²`,
  },
  {
    key: "electoralVotes",
    labelLines: ["Electoral", "Votes"],
    fmt: (s) => `${s.electoralVotes}`,
  },
  {
    key: "gdpPerCapita",
    labelLines: ["GDP / Capita"],
    fmt: (s) => `$${(s.gdpPerCapita / 1000).toFixed(0)}K`,
  },
  { key: "coastline", labelLines: ["Coastline"], fmt: (s) => s.coastline },
  { key: "yearOfStatehood", labelLines: ["Year of", "Statehood"], fmt: (s) => `${s.yearOfStatehood}` },
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

export function GuessTable({ guesses, maxRows }: { guesses: GuessResult[]; maxRows: number }) {
  const placeholderCount = Math.max(0, maxRows - guesses.length);

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
                  className="w-20 rounded bg-stone-700 px-1 py-2 text-center text-[10px] leading-tight font-semibold text-amber-50 sm:w-24 sm:py-3 sm:text-xs"
                >
                  <span className="flex min-h-10 items-center justify-center text-center">
                    <span>
                      {col.labelLines.map((line, index) => (
                        <span key={line} className="block">
                          {line}
                          {index < col.labelLines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </span>
                  </span>
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
            {Array.from({ length: placeholderCount }, (_, i) => (
              <PlaceholderGuessRow key={`placeholder-${i}`} columns={COLUMNS} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

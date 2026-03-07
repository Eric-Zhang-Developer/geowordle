import { CellState, GuessResult, State } from '../lib/gameLogic';

type Column = keyof Omit<State, 'name'>;

interface ColumnDef {
  key: Column;
  label: string;
  fmt: (s: State) => string;
}

const COLUMNS: ColumnDef[] = [
  { key: 'region',          label: 'Region',            fmt: s => s.region },
  { key: 'population',      label: 'Population',        fmt: s => s.population >= 1e6 ? `${(s.population / 1e6).toFixed(1)}M` : `${(s.population / 1e3).toFixed(0)}K` },
  { key: 'area',            label: 'Area (mi²)',         fmt: s => s.area.toLocaleString() },
  { key: 'gdpPerCapita',    label: 'GDP / Capita',       fmt: s => `$${(s.gdpPerCapita / 1000).toFixed(0)}K` },
  { key: 'coastline',       label: 'Coastline',         fmt: s => s.coastline },
  { key: 'medianAge',       label: 'Median Age',        fmt: s => `${s.medianAge}` },
  { key: 'yearOfStatehood', label: 'Year of Statehood', fmt: s => `${s.yearOfStatehood}` },
  { key: 'landlocked',      label: 'Landlocked',        fmt: s => s.landlocked ? 'Yes' : 'No' },
];

const BG: Record<CellState, string> = {
  correct:   'bg-green-600',
  incorrect: 'bg-red-600',
  partial:   'bg-yellow-600',
  close:     'bg-orange-500',
  higher:    'bg-red-600',
  lower:     'bg-red-600',
};

const INDICATOR: Partial<Record<CellState, string>> = {
  higher:  ' ▲',
  lower:   ' ▼',
  close:   ' ≈',
  partial: ' ~',
};

export function GuessTable({ guesses }: { guesses: GuessResult[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-400 px-3 py-1.5 bg-gray-200 text-xs text-left whitespace-nowrap">
              State
            </th>
            {COLUMNS.map(col => (
              <th key={col.key} className="border border-gray-400 px-3 py-1.5 bg-gray-200 text-xs text-left whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guesses.map((g, i) => (
            <tr key={i}>
              <td className="border border-gray-400 px-3 py-1.5 text-sm font-bold whitespace-nowrap">
                {g.state.name}
              </td>
              {COLUMNS.map(col => {
                const cell = g.cells[col.key];
                return (
                  <td key={col.key} className={`border border-gray-400 px-3 py-1.5 text-sm text-white min-w-20 ${BG[cell]}`}>
                    {col.fmt(g.state)}{INDICATOR[cell] ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

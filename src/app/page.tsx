'use client';

import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { CellState, State } from '../lib/gameLogic';

const COLUMNS = [
  'region', 'population', 'area', 'gdpPerCapita',
  'coastline', 'medianAge', 'yearOfStatehood', 'landlocked',
] as const;

type Column = typeof COLUMNS[number];

const BG: Record<CellState, string> = {
  correct:   '#16a34a',
  incorrect: '#dc2626',
  partial:   '#ca8a04',
  close:     '#ea580c',
  higher:    '#dc2626',
  lower:     '#dc2626',
};

const INDICATOR: Partial<Record<CellState, string>> = {
  higher: ' ▲',
  lower:  ' ▼',
  close:  ' ≈',
  partial: ' ~',
};

function fmt(col: Column, s: State): string {
  switch (col) {
    case 'population':
      return s.population >= 1e6
        ? `${(s.population / 1e6).toFixed(1)}M`
        : `${(s.population / 1e3).toFixed(0)}K`;
    case 'area':         return s.area.toLocaleString();
    case 'gdpPerCapita': return `$${(s.gdpPerCapita / 1000).toFixed(0)}K`;
    case 'medianAge':    return `${s.medianAge}`;
    case 'yearOfStatehood': return `${s.yearOfStatehood}`;
    case 'region':       return s.region;
    case 'coastline':    return s.coastline;
    case 'landlocked':   return s.landlocked ? 'Yes' : 'No';
  }
}

const th: React.CSSProperties = {
  border: '1px solid #999',
  padding: '6px 10px',
  background: '#e5e5e5',
  fontSize: 12,
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  border: '1px solid #999',
  padding: '6px 10px',
  fontSize: 13,
};

export default function Home() {
  const { guesses, selected, setSelected, submitGuess, isWon, remaining } = useGame();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const query = selected.trim().toLowerCase();
  const suggestions = query
    ? remaining
        .filter(s => {
          const words = s.name.toLowerCase().split(/\s+/);
          return words.some(w => w.startsWith(query));
        })
        .slice(0, 12)
    : [];

  return (
    <main style={{ padding: 32, fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>GeoWordle</h1>
      <p style={{ marginBottom: 24, color: '#666', fontSize: 13 }}>
        Guess the US state. Colors: green=correct, red=wrong, orange=close, yellow=partial, red+arrow=direction.
      </p>

      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>State</th>
              {COLUMNS.map(c => <th key={c} style={th}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {guesses.map((g, i) => (
              <tr key={i}>
                <td style={{ ...td, fontWeight: 'bold' }}>{g.state.name}</td>
                {COLUMNS.map(c => {
                  const state = g.cells[c];
                  return (
                    <td key={c} style={{ ...td, background: BG[state], color: '#fff', minWidth: 80 }}>
                      {fmt(c, g.state)}{INDICATOR[state] ?? ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isWon ? (
        <p style={{ color: 'green', fontSize: 20, fontWeight: 'bold' }}>
          Got it in {guesses.length} guess{guesses.length !== 1 ? 'es' : ''}!
        </p>
      ) : (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={selected}
              placeholder="Type a state..."
              onChange={e => {
                setSelected(e.target.value);
                setIsPickerOpen(true);
              }}
              onFocus={() => setIsPickerOpen(true)}
              onBlur={() => {
                // Let suggestion clicks land before closing.
                window.setTimeout(() => setIsPickerOpen(false), 120);
              }}
              style={{
                padding: '8px 12px',
                fontSize: 15,
                width: 220,
                border: '1px solid #999',
                borderRadius: 4,
                background: '#fff',
              }}
            />
            {isPickerOpen && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #999',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  zIndex: 10,
                  maxHeight: 240,
                  overflowY: 'auto',
                }}
              >
                {suggestions.map(s => (
                  <div
                    key={s.name}
                    onMouseDown={e => {
                      e.preventDefault();
                      submitGuess(s.name);
                      setIsPickerOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      fontSize: 14,
                      background: '#fff',
                    }}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

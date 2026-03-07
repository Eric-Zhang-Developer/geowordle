'use client';
import { useEffect, useState } from 'react';
import { CellState, GuessResult, State } from '../lib/gameLogic';

type ColDef = { key: keyof Omit<State, 'name'>; fmt: (s: State) => string };

interface GuessRowProps {
  guess: GuessResult;
  isNew: boolean;
  columns: ColDef[];
  bg: Record<CellState, string>;
  indicator: Partial<Record<CellState, string>>;
}

const STAGGER_MS = 150;

export function GuessRow({ guess, isNew, columns, bg, indicator }: GuessRowProps) {
  const total = columns.length + 1; // +1 for name cell
  const [revealed, setRevealed] = useState(isNew ? 0 : total);

  useEffect(() => {
    if (!isNew) return;
    const timers = Array.from({ length: total }, (_, i) =>
      setTimeout(() => setRevealed(i + 1), i * STAGGER_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const base = 'text-sm font-semibold px-4 py-4 text-center border border-gray-700';

  return (
    <tr>
      <td className={`${base} whitespace-nowrap font-bold text-white min-w-24
        ${revealed > 0 ? 'bg-gray-900' : 'bg-gray-700'}
        ${revealed === 1 ? 'cell-flip' : ''}`}>
        {revealed > 0 ? guess.state.name : ''}
      </td>
      {columns.map((col, i) => {
        const cellIdx = i + 1;
        const isRevealed = revealed > cellIdx;
        const isFlipping = revealed === cellIdx + 1;
        const cell = guess.cells[col.key];
        return (
          <td
            key={col.key}
            className={`${base} text-white min-w-24
              ${isRevealed ? bg[cell] : 'bg-gray-700'}
              ${isFlipping ? 'cell-flip' : ''}`}
          >
            {isRevealed ? `${col.fmt(guess.state)}${indicator[cell] ?? ''}` : ''}
          </td>
        );
      })}
    </tr>
  );
}

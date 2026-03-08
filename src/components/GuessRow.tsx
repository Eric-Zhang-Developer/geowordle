"use client";
import { useEffect, useState } from "react";
import { CellDirection, CellState, GuessResult, State } from "../lib/gameLogic";

type ColDef = { key: keyof Omit<State, "name">; fmt: (s: State) => string };

interface GuessRowProps {
  guess: GuessResult;
  isNew: boolean;
  columns: ColDef[];
  bg: Record<CellState, string>;
  indicator: Record<CellDirection, string>;
}

const STAGGER_MS = 300;

export function GuessRow({ guess, isNew, columns, bg, indicator }: GuessRowProps) {
  const total = columns.length + 1; // +1 for name cell
  const [revealed, setRevealed] = useState(isNew ? 0 : total);

  useEffect(() => {
    if (!isNew) return;
    // +1 extra timer clears the last cell's isFlipping overlay
    const timers = Array.from({ length: total + 1 }, (_, i) =>
      setTimeout(() => setRevealed(i + 1), i * STAGGER_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const base =
    "text-sm font-semibold text-center align-middle rounded h-24 relative overflow-hidden";

  // name cell: active once revealed >= 1
  const nameActive = revealed >= 1;
  const nameFlipping = revealed === 1;

  return (
    <tr>
      <td
        className={`${base} whitespace-nowrap font-bold text-white w-28
        ${nameActive ? "bg-gray-900" : "bg-gray-700"}`}
      >
        {nameActive && guess.state.name}
        {nameFlipping && <span className="absolute inset-0 bg-gray-700 rounded animate-cell-uncover origin-right" />}
      </td>
      {columns.map((col, i) => {
        const cellIdx = i + 1;
        const isActive = revealed >= cellIdx + 1;
        const isFlipping = revealed === cellIdx + 1;
        const cell = guess.cells[col.key];
        return (
          <td
            key={col.key}
            className={`${base} text-white w-24 ${isActive ? bg[cell.state] : "bg-gray-700"}`}
          >
            {isActive && `${col.fmt(guess.state)}${cell.direction ? indicator[cell.direction] : ""}`}
            {isFlipping && <span className="absolute inset-0 bg-gray-700 rounded animate-cell-uncover origin-right" />}
          </td>
        );
      })}
    </tr>
  );
}

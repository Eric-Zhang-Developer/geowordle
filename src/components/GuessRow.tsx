"use client";
import { useEffect, useState } from "react";
import { CellDirection, CellState, GuessResult, State } from "../lib/gameLogic";

const STATE_PICS = "state-pics";

function statePicSrc(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `/${STATE_PICS}/${slug}.png`;
}

type ColDef = { key: keyof Omit<State, "name">; fmt: (s: State) => string };

interface GuessRowProps {
  guess: GuessResult;
  isNew: boolean;
  columns: ColDef[];
  bg: Record<CellState, string>;
  indicator: Record<CellDirection, string>;
}

const STAGGER_MS = 400; // must be > animation duration (350ms)

export function GuessRow({ guess, isNew, columns, bg, indicator }: GuessRowProps) {
  const total = columns.length + 1; // +1 for name cell
  const [revealed, setRevealed] = useState(isNew ? 0 : total);

  useEffect(() => {
    if (!isNew) return;
    const timers = Array.from({ length: total }, (_, i) =>
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
        className={`${base} font-bold text-white min-w-[180px] px-0
        ${nameActive ? "bg-gray-900" : "bg-gray-700"}`}
      >
        {nameActive && (
          <div className="flex items-center gap-3 h-full w-full px-3">
            <img
              src={statePicSrc(guess.state.name)}
              alt=""
              className="w-14 h-14 object-contain flex-shrink-0"
            />
            <span className="flex-1 text-left truncate">{guess.state.name}</span>
          </div>
        )}
        {nameFlipping && <span className="absolute inset-0 bg-gray-700 rounded cell-uncover" />}
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
            {isFlipping && <span className="absolute inset-0 bg-gray-700 rounded cell-uncover" />}
          </td>
        );
      })}
    </tr>
  );
}

"use client";
import Image from "next/image";
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

const STAGGER_MS = 300;
const BASE_CELL_CLASS =
  "relative h-20 overflow-hidden rounded text-center align-middle text-xs font-semibold sm:h-24 sm:text-sm";

export function GuessRow({ guess, isNew, columns, bg, indicator }: GuessRowProps) {
  const total = columns.length + 1; // +1 for name cell
  const [revealed, setRevealed] = useState(isNew ? 0 : total);

  useEffect(() => {
    if (!isNew) return;
    // +1 extra timer clears the last cell's isFlipping overlay
    const timers = Array.from({ length: total + 1 }, (_, i) =>
      setTimeout(() => {
        setRevealed(i + 1);
        if (i < total) new Audio("/sounds/card-flip.mp3").play().catch(() => {});
      }, i * STAGGER_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // name cell: active once revealed >= 1
  const nameActive = revealed >= 1;
  const nameFlipping = revealed === 1;

  return (
    <tr>
      <td
        className={`${BASE_CELL_CLASS} min-w-[132px] px-0 font-bold text-amber-50 sm:min-w-[180px]
        ${nameActive ? "bg-amber-950" : "bg-stone-700"}`}
      >
        {nameActive && (
          <div className="flex h-full w-full items-center gap-2 px-2 sm:gap-3 sm:px-3">
            <Image
              src={statePicSrc(guess.state.name)}
              alt=""
              width={56}
              height={56}
              sizes="(max-width: 640px) 40px, 56px"
              className="h-10 w-10 flex-shrink-0 object-contain sm:h-14 sm:w-14"
              unoptimized
            />
            <span className="flex-1 truncate text-left">{guess.state.name}</span>
          </div>
        )}
        {nameFlipping && <span className="absolute inset-0 bg-stone-700 rounded animate-cell-uncover origin-right" />}
      </td>
      {columns.map((col, i) => {
        const cellIdx = i + 1;
        const isActive = revealed >= cellIdx + 1;
        const isFlipping = revealed === cellIdx + 1;
        const cell = guess.cells[col.key];
        return (
          <td
            key={col.key}
            className={`${BASE_CELL_CLASS} w-[88px] text-white sm:w-24 ${isActive ? bg[cell.state] : "bg-stone-700"}`}
          >
            {isActive && `${col.fmt(guess.state)}${cell.direction ? indicator[cell.direction] : ""}`}
            {isFlipping && <span className="absolute inset-0 bg-stone-700 rounded animate-cell-uncover origin-right" />}
          </td>
        );
      })}
    </tr>
  );
}

export function PlaceholderGuessRow({ columns }: { columns: ColDef[] }) {
  return (
    <tr>
      <td className={`${BASE_CELL_CLASS} min-w-[132px] bg-stone-700 sm:min-w-[180px]`} />
      {columns.map((col) => (
        <td key={col.key} className={`${BASE_CELL_CLASS} w-[88px] bg-stone-700 sm:w-24`} />
      ))}
    </tr>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  CellDirection,
  CellState,
  getPopulationDensity,
  GuessResult,
  State,
} from "../lib/gameLogic";
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
  {
    key: "yearOfStatehood",
    labelLines: ["Year of", "Statehood"],
    fmt: (s) => `${s.yearOfStatehood}`,
  },
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

const SCROLL_HINT_THRESHOLD_PX = 12;
const SCROLL_EDGE_TOLERANCE_PX = 4;

export function GuessTable({ guesses, maxRows }: { guesses: GuessResult[]; maxRows: number }) {
  const placeholderCount = Math.max(0, maxRows - guesses.length);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    function updateScrollAffordances() {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
      const canScroll = maxScrollLeft > SCROLL_EDGE_TOLERANCE_PX;
      const nextShowLeftFade = canScroll && scrollEl.scrollLeft > SCROLL_EDGE_TOLERANCE_PX;
      const nextShowRightFade =
        canScroll && scrollEl.scrollLeft < maxScrollLeft - SCROLL_EDGE_TOLERANCE_PX;

      setShowLeftFade(nextShowLeftFade);
      setShowRightFade(nextShowRightFade);

      if (scrollEl.scrollLeft > SCROLL_HINT_THRESHOLD_PX) {
        setHasScrolled((prev) => prev || true);
      }
    }

    updateScrollAffordances();

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const resizeObserver = new ResizeObserver(() => updateScrollAffordances());
    resizeObserver.observe(scrollEl);

    const tableEl = scrollEl.querySelector("table");
    if (tableEl instanceof Element) {
      resizeObserver.observe(tableEl);
    }

    scrollEl.addEventListener("scroll", updateScrollAffordances, { passive: true });
    window.addEventListener("resize", updateScrollAffordances);

    return () => {
      resizeObserver.disconnect();
      scrollEl.removeEventListener("scroll", updateScrollAffordances);
      window.removeEventListener("resize", updateScrollAffordances);
    };
  }, [guesses.length, maxRows]);

  return (
    <div className="mb-10 w-full min-w-0 max-w-full sm:mb-5 sm:w-fit">
      {!hasScrolled && showRightFade && (
        <div className="mb-3 flex justify-center sm:hidden">
          <span className="rounded-full border border-stone-600/90 bg-stone-900/85 px-3 py-1 text-xs font-semibold tracking-[0.02em] text-amber-50 shadow-md backdrop-blur-sm">
            Swipe sideways for more clues
          </span>
        </div>
      )}
      <div className="relative">
        <div
          ref={scrollRef}
          className="w-full min-w-0 max-w-full touch-pan-x overflow-x-auto overscroll-x-contain pb-2 sm:pb-1"
        >
          <table className="min-w-max border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="min-w-[104px] rounded bg-stone-700 px-1.5 py-1.5 text-center text-[9px] font-semibold whitespace-nowrap text-amber-50 sm:min-w-[180px] sm:px-2 sm:py-3 sm:text-xs">
                  State
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="w-[66px] rounded bg-stone-700 px-1 py-1.5 text-center text-[9px] leading-tight font-semibold text-amber-50 sm:w-24 sm:py-3 sm:text-xs"
                  >
                    <span className="flex min-h-8 items-center justify-center text-center sm:min-h-10">
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
        {showLeftFade && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-linear-to-r from-stone-900/85 via-stone-900/45 to-transparent sm:hidden" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-stone-900/85 via-stone-900/45 to-transparent sm:hidden" />
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import USAMap from "react-usa-map";
import { GuessResult } from "../lib/gameLogic";
import { STATE_ABBREVIATIONS } from "../lib/stateAbbreviations";

export function RecapMap({ guesses }: { guesses: GuessResult[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapWidth, setMapWidth] = useState(0);
  const customize: Record<string, { fill: string }> = {};

  guesses.forEach((g) => {
    const abbr = STATE_ABBREVIATIONS[g.state.name];
    if (!abbr) return;
    customize[abbr] = { fill: g.isWin ? "#15803d" : "#991b1b" };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    function updateWidth() {
      if (!containerRef.current) return;
      setMapWidth(Math.min(containerRef.current.clientWidth, 900));
    }

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const width = mapWidth || 320;
  const height = Math.round(width * 0.63);

  return (
    <div ref={containerRef} className="mt-4 flex w-full max-w-4xl flex-col items-center">
      <p className="text-sm text-gray-400 text-center mb-1">Your guesses</p>
      <div className="w-full overflow-hidden">
        <USAMap
          customize={customize}
          defaultFill="#374151"
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}

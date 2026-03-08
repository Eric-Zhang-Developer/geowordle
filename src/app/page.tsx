"use client";

import { useState } from "react";
import Image from "next/image";
import { useGame } from "../hooks/useGame";
import { GuessTable } from "../components/GuessTable";
import { RecapMap } from "../components/RecapMap";

const STATE_PICS_FOLDER = "state-pics";
const STATE_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

function stateImagePath(name: string, ext: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `/${STATE_PICS_FOLDER}/${slug}${ext}`;
}

function StateThumb({ name }: { name: string }) {
  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const ext = STATE_IMAGE_EXTENSIONS[extIndex];
  const hasNext = extIndex + 1 < STATE_IMAGE_EXTENSIONS.length;

  if (failed || !ext) {
    return (
      <div
        className="w-12 h-12 flex-shrink-0"
        title={`Place image in public/${STATE_PICS_FOLDER}/ as ${name.toLowerCase().replace(/\s+/g, "-")}.png (or .jpg)`}
      />
    );
  }

  return (
    <Image
      src={stateImagePath(name, ext)}
      alt=""
      width={48}
      height={48}
      className="w-12 h-12 object-contain flex-shrink-0"
      onError={() => {
        if (hasNext) setExtIndex((i) => i + 1);
        else setFailed(true);
      }}
      unoptimized
    />
  );
}

export default function Home() {
  const {
    mode,
    round,
    guesses,
    selected,
    setSelected,
    submitGuess,
    isWon,
    remaining,
    switchToEndless,
    nextRound,
  } = useGame();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const query = selected.trim().toLowerCase();
  const suggestions =
    query === ""
      ? []
      : remaining
          .filter((s) => {
            const nameLower = s.name.toLowerCase();
            const words = nameLower.split(/\s+/);
            return (
              nameLower.startsWith(query) ||
              words.some((w) => w.startsWith(query))
            );
          })
          .slice(0, 12);

  return (
    <main className="p-8 font-mono flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold">GeoWordle</h1>
        {mode === "daily" ? (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-900 text-blue-300 border border-blue-700">
            Daily
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-900 text-purple-300 border border-purple-700">
            Endless · Round {round}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mb-6 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-700" />
          Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-700" />
          Wrong
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />
          Close
        </span>
        <span className="text-gray-500">▲▼ = too low / too high</span>
      </div>

      {isWon ? (
        <div className="space-y-3 mb-6">
          <p className="text-green-400 text-xl font-bold">
            Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
          </p>
          {mode === "daily" ? (
            <button
              onClick={switchToEndless}
              className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
            >
              Try Endless Mode
            </button>
          ) : (
            <button
              onClick={nextRound}
              className="px-5 py-2 text-base bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600"
            >
              Next Round
            </button>
          )}
        </div>
      ) : (
        <div className="relative w-full max-w-sm mb-6">
          <input
            value={selected}
            placeholder="Type a state..."
            onChange={(e) => {
              setSelected(e.target.value);
              setIsPickerOpen(true);
            }}
            onFocus={() => setIsPickerOpen(true)}
            onBlur={() => {
              // Let suggestion clicks land before closing.
              window.setTimeout(() => setIsPickerOpen(false), 120);
            }}
            className="w-full px-3 py-2 text-base bg-gray-900 text-white border border-gray-600 rounded outline-none placeholder-gray-500 focus:border-blue-400"
          />
          {isPickerOpen && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-700 rounded shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submitGuess(s.name);
                    setIsPickerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-base hover:bg-gray-800 cursor-pointer"
                >
                  <StateThumb name={s.name} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isWon && <RecapMap guesses={guesses} />}
      <GuessTable guesses={guesses} />
    </main>
  );
}

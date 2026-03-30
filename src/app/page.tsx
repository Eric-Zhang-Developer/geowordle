"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGame } from "../hooks/useGame";
import { GuessResult } from "../lib/gameLogic";
import { GuessTable } from "../components/GuessTable";
import { RecapMap } from "../components/RecapMap";
import { StateSearch } from "../components/StateSearch";
import { VictoryConfetti } from "../components/VictoryConfetti";
import { RoundStatus } from "../lib/gameRules";

const SHARE_KEYS = [
  "region",
  "population",
  "area",
  "density",
  "electoralVotes",
  "gdpPerCapita",
  "coastline",
  "yearOfStatehood",
] as const;
const EMOJI: Record<string, string> = { correct: "🟩", close: "🟨", incorrect: "🟥" };

function generateShareString(guesses: GuessResult[], mode: string, round: number): string {
  const header =
    mode === "daily"
      ? `Statle (Daily) - ${guesses.length} Guesses`
      : `Statle (Endless R${round}) - ${guesses.length} Guesses`;
  const rows = guesses
    .map((g) => SHARE_KEYS.map((k) => EMOJI[g.cells[k].state]).join(""))
    .join("\n");
  return `${header}\n\n${rows}`;
}

const VICTORY_REVEAL_DELAY_MS = 2500;

export default function Home() {
  const {
    mode,
    round,
    guesses,
    selected,
    setSelected,
    submitGuess,
    status,
    remaining,
    targetName,
    maxGuesses,
    switchToEndless,
    nextRound,
  } = useGame();

  const [isVictoryRevealed, setIsVictoryRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const recapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "won") return;
    const timer = window.setTimeout(() => {
      setIsVictoryRevealed(true);
      new Audio("/sounds/victory.mp3").play().catch(() => {});
    }, VICTORY_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "lost") return;
    const timer = window.setTimeout(() => {
      new Audio("/sounds/lose.mp3").play().catch(() => {});
    }, VICTORY_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const isTerminalRevealed = status === "lost" || (status === "won" && isVictoryRevealed);

  useEffect(() => {
    if (!isTerminalRevealed) return;
    recapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isTerminalRevealed]);

  function handleSwitchToEndless() {
    setIsVictoryRevealed(false);
    switchToEndless();
  }

  function handleNextRound() {
    setIsVictoryRevealed(false);
    nextRound();
  }

  function handleShare() {
    navigator.clipboard.writeText(generateShareString(guesses, mode, round));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const isWon = status === "won";
  const isLost = status === "lost";

  function renderTerminalPanel(roundStatus: RoundStatus) {
    if (!isTerminalRevealed) return null;

    if (roundStatus === "won") {
      return (
        <div
          ref={recapRef}
          className="mt-6 mb-2 flex flex-col items-center gap-4 rounded-2xl bg-stone-900/75 px-8 py-6 text-center backdrop-blur-sm"
        >
          <p className="text-3xl font-bold text-green-400 drop-shadow-lg">
            Got it in {guesses.length} guess{guesses.length !== 1 ? "es" : ""}!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShare}
              className="cursor-pointer rounded bg-blue-500 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-600"
            >
              {copied ? "Copied!" : "Share"}
            </button>
            {mode === "daily" ? (
              <button
                onClick={handleSwitchToEndless}
                className="cursor-pointer rounded bg-purple-500 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-600"
              >
                Try Endless Mode
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="cursor-pointer rounded bg-purple-500 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-600"
              >
                Next Round
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={recapRef}
        className="mt-6 mb-2 flex flex-col items-center gap-4 rounded-2xl bg-stone-900/75 px-8 py-6 text-center backdrop-blur-sm"
      >
        <p className="text-3xl font-bold text-red-400 drop-shadow-lg">
          The correct state was {targetName}.
        </p>
        {mode === "daily" ? (
          <button
            onClick={handleSwitchToEndless}
            className="cursor-pointer rounded bg-purple-500 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-600"
          >
            Try Endless Mode
          </button>
        ) : (
          <button
            onClick={handleNextRound}
            className="cursor-pointer rounded bg-purple-500 px-8 py-3 text-lg font-semibold text-white hover:bg-purple-600"
          >
            Next Round
          </button>
        )}
      </div>
    );
  }

  return (
    <main className="w-full overflow-x-hidden px-3 pt-4 pb-2 sm:px-4 sm:pt-5 sm:pb-2">
      <VictoryConfetti active={isWon && isTerminalRevealed} />
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col items-center xl:max-w-[1750px]">
        <div className="mb-3 flex flex-col items-center gap-1.5 sm:mb-2 sm:gap-2">
          <h1>
            <Image
              src="/assets/Statle.webp"
              alt="Statle"
              width={428}
              height={211}
              sizes="(max-width: 640px) 256px, 320px"
              className="h-[49px] w-auto sm:h-[65px]"
              priority
            />
          </h1>
          {mode === "daily" ? (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-900/80 text-amber-100 border border-stone-700">
              Daily
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-900/80 text-purple-200 border border-stone-700">
              Endless · Round {round}
            </span>
          )}
        </div>
        <div className="w-full xl:flex xl:items-start xl:justify-start xl:gap-6">
          <div className="flex w-full min-w-0 flex-col items-center xl:w-fit xl:max-w-full xl:flex-none xl:items-start">
            <div className="bg-stone-900/70 py-2 px-3 rounded-2xl mb-2">
              <div className="mb-2 flex w-full max-w-[320px] flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[11px] text-amber-100 sm:max-w-[420px] sm:gap-x-3 sm:gap-y-2 sm:text-xs md:max-w-[520px] lg:max-w-[620px] xl:mb-3 xl:max-w-none xl:justify-start">
                <span className="flex items-center gap-1 whitespace-nowrap ">
                  <span className="inline-block w-3 h-3 rounded-sm bg-green-700" />
                  <span>Correct</span>
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-700" />
                  Wrong
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />
                  Close
                </span>
                <span className="text-center">▲▼ = too low / too high</span>
              </div>

              <StateSearch
                value={selected}
                remaining={remaining}
                onChange={setSelected}
                onSubmit={submitGuess}
                disabled={status !== "playing"}
              />
            </div>

            <div className="w-full min-w-0 self-stretch rounded-2xl bg-stone-900/70 p-2.5 pb-2 backdrop-blur-sm flex items-center justify-center xl:w-fit xl:max-w-full xl:self-start xl:px-2.5 xl:pt-3 xl:pb-1 xl:flex-none">
              <GuessTable guesses={guesses} maxRows={maxGuesses} />
            </div>
          </div>
          <div className="hidden xl:block xl:min-w-[300px] xl:max-w-[800px] xl:flex-1 xl:mt-[110px]">
            <div className="rounded-2xl bg-stone-900/60 p-3 backdrop-blur-sm">
              <RecapMap guesses={guesses} />
            </div>
          </div>
        </div>
        <div className="w-full max-w-[320px] self-center sm:max-w-[380px] md:max-w-[460px] lg:max-w-[560px] xl:hidden">
          <RecapMap guesses={guesses} />
        </div>
        {(isWon || isLost) && renderTerminalPanel(status)}
      </div>
    </main>
  );
}

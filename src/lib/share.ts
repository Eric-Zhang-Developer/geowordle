import type { GuessResult } from "./gameLogic";

const STATLE_URL = "https://statle.vercel.app/";

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

const EMOJI: Record<string, string> = {
  correct: "🟩",
  close: "🟨",
  incorrect: "🟥",
};

export function generateShareString(
  guesses: GuessResult[],
  status: "won" | "lost",
  dailyDate: string
): string {
  const score = status === "won" ? `${guesses.length}/6` : "X/6";
  const header = `Statle Daily ${dailyDate} ${score}`;
  const rows = guesses
    .map((g) => SHARE_KEYS.map((key) => EMOJI[g.cells[key].state]).join(""))
    .join("\n");
  return `${header}\n\n${rows}\n\n${STATLE_URL}`;
}

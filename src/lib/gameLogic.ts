export type CellState = "correct" | "incorrect" | "close";
export type CellDirection = "higher" | "lower";

export interface GuessCell {
  state: CellState;
  direction?: CellDirection;
}

export interface State {
  name: string;
  region: string;
  population: number;
  area: number;
  electoralVotes: number;
  gdpPerCapita: number;
  coastline: string;
  yearOfStatehood: number;
}

export interface GuessResult {
  state: State;
  cells: Record<string, GuessCell>;
  isWin: boolean;
}

export function getPopulationDensity(state: Pick<State, "population" | "area">): number {
  return state.population / state.area;
}

function numericCompare(
  guessVal: number,
  targetVal: number,
  threshold: number,
  isPercent: boolean,
): GuessCell {
  if (guessVal === targetVal) return { state: "correct" };
  const diff = isPercent
    ? Math.abs(guessVal - targetVal) / targetVal
    : Math.abs(guessVal - targetVal);
  const direction = guessVal < targetVal ? "higher" : "lower";
  if (diff <= threshold) return { state: "close", direction };
  return { state: "incorrect", direction };
}

export function compareGuess(guess: State, target: State): GuessResult {
  const electoralVotesCloseThreshold = Math.max(2, Math.ceil(target.electoralVotes * 0.2));
  const cells: Record<string, GuessCell> = {
    region: { state: guess.region === target.region ? "correct" : "incorrect" },
    population: numericCompare(guess.population, target.population, 0.2, true),
    area: numericCompare(guess.area, target.area, 0.2, true),
    density: numericCompare(getPopulationDensity(guess), getPopulationDensity(target), 0.2, true),
    electoralVotes: numericCompare(guess.electoralVotes, target.electoralVotes, electoralVotesCloseThreshold, false),
    gdpPerCapita: numericCompare(guess.gdpPerCapita, target.gdpPerCapita, 0.15, true),
    coastline: { state: guess.coastline === target.coastline ? "correct" : "incorrect" },
    yearOfStatehood: numericCompare(guess.yearOfStatehood, target.yearOfStatehood, 20, false),
  };

  return { state: guess, cells, isWin: guess.name === target.name };
}

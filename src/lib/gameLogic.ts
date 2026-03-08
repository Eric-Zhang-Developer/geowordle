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
  gdpPerCapita: number;
  coastline: string;
  medianAge: number;
  yearOfStatehood: number;
  landlocked: boolean;
}

export interface GuessResult {
  state: State;
  cells: Record<string, GuessCell>;
  isWin: boolean;
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
  const cells: Record<string, GuessCell> = {
    region: { state: guess.region === target.region ? "correct" : "incorrect" },
    population: numericCompare(guess.population, target.population, 0.2, true),
    area: numericCompare(guess.area, target.area, 0.2, true),
    gdpPerCapita: numericCompare(guess.gdpPerCapita, target.gdpPerCapita, 0.15, true),
    coastline: { state: guess.coastline === target.coastline ? "correct" : "incorrect" },
    medianAge: numericCompare(guess.medianAge, target.medianAge, 3, false),
    yearOfStatehood: numericCompare(guess.yearOfStatehood, target.yearOfStatehood, 20, false),
    landlocked: { state: guess.landlocked === target.landlocked ? "correct" : "incorrect" },
  };

  return { state: guess, cells, isWin: guess.name === target.name };
}

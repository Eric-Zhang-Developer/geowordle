export type CellState = "correct" | "incorrect" | "close" | "higher" | "lower";

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
  cells: Record<string, CellState>;
  isWin: boolean;
}

function numericCompare(
  guessVal: number,
  targetVal: number,
  threshold: number,
  isPercent: boolean,
): CellState {
  if (guessVal === targetVal) return "correct";
  const diff = isPercent
    ? Math.abs(guessVal - targetVal) / targetVal
    : Math.abs(guessVal - targetVal);
  if (diff <= threshold) return "close";
  return guessVal < targetVal ? "higher" : "lower";
}

export function compareGuess(guess: State, target: State): GuessResult {
  const cells: Record<string, CellState> = {
    region: guess.region === target.region ? "correct" : "incorrect",
    population: numericCompare(guess.population, target.population, 0.2, true),
    area: numericCompare(guess.area, target.area, 0.2, true),
    gdpPerCapita: numericCompare(guess.gdpPerCapita, target.gdpPerCapita, 0.15, true),
    coastline: guess.coastline === target.coastline ? "correct" : "incorrect",
    medianAge: numericCompare(guess.medianAge, target.medianAge, 3, false),
    yearOfStatehood: numericCompare(guess.yearOfStatehood, target.yearOfStatehood, 20, false),
    landlocked: guess.landlocked === target.landlocked ? "correct" : "incorrect",
  };

  return { state: guess, cells, isWin: guess.name === target.name };
}

import statesData from '../data/states.json';
import type { State } from './gameLogic';

export function getTodaysState(): State {
  const demoState = statesData.find((state) => state.name === 'Pennsylvania');
  if (demoState) return demoState as State;

  // Temporary judging override above; keep the seeded fallback intact for later.
  const epoch = new Date('2026-01-01').getTime();
  const dayIndex = Math.floor((Date.now() - epoch) / (1000 * 60 * 60 * 24));
  return statesData[dayIndex % statesData.length] as State;
}

export function getRandomState(excludeNames: Set<string>): State {
  const pool = (statesData as State[]).filter(s => !excludeNames.has(s.name));
  const source = pool.length > 0 ? pool : (statesData as State[]);
  return source[Math.floor(Math.random() * source.length)];
}

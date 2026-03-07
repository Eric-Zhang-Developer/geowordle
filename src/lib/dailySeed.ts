import statesData from '../data/states.json';
import type { State } from './gameLogic';

export function getTodaysState(): State {
  const epoch = new Date('2026-01-01').getTime();
  const dayIndex = Math.floor((Date.now() - epoch) / (1000 * 60 * 60 * 24));
  return statesData[dayIndex % statesData.length] as State;
}

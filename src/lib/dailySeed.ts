import statesData from '../data/states.json';
import type { State } from './gameLogic';

const DAILY_STATE_ORDER = [
  'Indiana',
  'Rhode Island',
  'Maine',
  'Pennsylvania',
  'Nebraska',
  'Texas',
  'Illinois',
  'Ohio',
  'Washington',
  'Idaho',
  'Oklahoma',
  'Wisconsin',
  'Delaware',
  'Louisiana',
  'Maryland',
  'South Dakota',
  'Kansas',
  'Alabama',
  'Mississippi',
  'Virginia',
  'Montana',
  'California',
  'Kentucky',
  'Colorado',
  'Oregon',
  'Minnesota',
  'Iowa',
  'New Mexico',
  'Missouri',
  'Massachusetts',
  'Florida',
  'Hawaii',
  'Arkansas',
  'North Dakota',
  'New Hampshire',
  'Vermont',
  'Georgia',
  'Utah',
  'Tennessee',
  'West Virginia',
  'South Carolina',
  'Connecticut',
  'North Carolina',
  'Nevada',
  'Michigan',
  'New Jersey',
  'New York',
  'Wyoming',
  'Arizona',
  'Alaska',
] as const;

const STATE_BY_NAME = new Map((statesData as State[]).map((state) => [state.name, state]));
const DAILY_EPOCH_MS = new Date('2026-01-01').getTime();

function getDailyDayIndex(nowMs: number = Date.now()): number {
  return Math.floor((nowMs - DAILY_EPOCH_MS) / (1000 * 60 * 60 * 24));
}

export function getTodaysState(): State {
  const dayIndex = getDailyDayIndex();
  const stateName = DAILY_STATE_ORDER[dayIndex % DAILY_STATE_ORDER.length];
  return STATE_BY_NAME.get(stateName) ?? ((statesData as State[])[0] as State);
}

export function getTodaysPuzzleDateString(): string {
  const dayIndex = getDailyDayIndex();
  const puzzleDate = new Date(DAILY_EPOCH_MS + dayIndex * 24 * 60 * 60 * 1000);
  return puzzleDate.toISOString().slice(0, 10);
}

export function getRandomState(excludeNames: Set<string>): State {
  const pool = (statesData as State[]).filter(s => !excludeNames.has(s.name));
  const source = pool.length > 0 ? pool : (statesData as State[]);
  return source[Math.floor(Math.random() * source.length)];
}

'use client';
import { useState } from 'react';
import statesData from '../data/states.json';
import { compareGuess, GuessResult, State } from '../lib/gameLogic';
import { getTodaysState, getRandomState } from '../lib/dailySeed';
import { MAX_GUESSES, RoundStatus } from '../lib/gameRules';

type Mode = 'daily' | 'endless';

export function useGame() {
  const [mode, setMode]         = useState<Mode>('daily');
  const [round, setRound]       = useState(1);
  const [playedNames, setPlayedNames] = useState<Set<string>>(new Set());
  const [target, setTarget]     = useState<State>(() => getTodaysState());
  const [guesses, setGuesses]   = useState<GuessResult[]>([]);
  const [selected, setSelected] = useState('');

  const isWon = guesses.some(g => g.isWin);
  const status: RoundStatus = isWon ? 'won' : guesses.length >= MAX_GUESSES ? 'lost' : 'playing';
  const guessedNames = new Set(guesses.map(g => g.state.name));
  const remaining = (statesData as State[]).filter(s => !guessedNames.has(s.name));

  function submitGuess(name?: string) {
    if (status !== 'playing') return;
    const guessName = name ?? selected;
    if (!guessName) return;
    const state = (statesData as State[]).find(s => s.name === guessName);
    if (!state) return;
    setGuesses(prev => [...prev, compareGuess(state, target)]);
    setSelected('');
  }

  function switchToEndless() {
    const seeded = new Set([target.name]);
    const next = getRandomState(seeded);
    setPlayedNames(new Set([...seeded, next.name]));
    setTarget(next);
    setGuesses([]);
    setSelected('');
    setMode('endless');
    setRound(1);
  }

  function nextRound() {
    const next = getRandomState(playedNames);
    setPlayedNames(prev => new Set([...prev, next.name]));
    setTarget(next);
    setGuesses([]);
    setSelected('');
    setRound(r => r + 1);
  }

  return {
    mode,
    round,
    guesses,
    selected,
    setSelected,
    submitGuess,
    isWon,
    status,
    remaining,
    targetName: target.name,
    maxGuesses: MAX_GUESSES,
    switchToEndless,
    nextRound,
  };
}

'use client';

import { useState } from 'react';
import statesData from '../data/states.json';
import { compareGuess, GuessResult, State } from '../lib/gameLogic';
import { getTodaysState } from '../lib/dailySeed';

export function useGame() {
  const [target] = useState<State>(() => getTodaysState());
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [selected, setSelected] = useState('');

  const isWon = guesses.some(g => g.isWin);
  const guessedNames = new Set(guesses.map(g => g.state.name));
  const remaining = (statesData as State[]).filter(s => !guessedNames.has(s.name));

  function submitGuess(name?: string) {
    const guessName = name ?? selected;
    if (!guessName) return;
    const state = (statesData as State[]).find(s => s.name === guessName);
    if (!state) return;
    setGuesses(prev => [...prev, compareGuess(state, target)]);
    setSelected('');
  }

  return { guesses, selected, setSelected, submitGuess, isWon, remaining };
}

import { describe, expect, it } from 'vitest';
import { createGame, getResult, submitGuess } from './game.js';

const settings = { length: 4, base: 10 };
const newGame = () => createGame(settings, '1234', 1000);

describe('createGame', () => {
  it('starts with empty history and no finish time', () => {
    const game = newGame();
    expect(game.history).toEqual([]);
    expect(game.finishedAt).toBeNull();
    expect(game.startedAt).toBe(1000);
  });
});

describe('submitGuess', () => {
  it('adds an attempt with bulls and cows', () => {
    const { state, status } = submitGuess(newGame(), '1243', 2000);
    expect(status).toBe('accepted');
    expect(state.history).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
  });

  it('does not mutate the previous state', () => {
    const before = newGame();
    const { state } = submitGuess(before, '1243', 2000);
    expect(before.history).toHaveLength(0);
    expect(state).not.toBe(before);
    expect(state.history).not.toBe(before.history);
  });

  it('keeps old entries unchanged', () => {
    const first = submitGuess(newGame(), '1243', 2000).state;
    const second = submitGuess(first, '5678', 3000).state;
    expect(second.history).toHaveLength(2);
    expect(second.history[0]).toBe(first.history[0]);
  });

  it('rejects an invalid guess and keeps the state', () => {
    const game = newGame();
    const result = submitGuess(game, '11', 2000);
    expect(result.status).toBe('invalid');
    expect(result.state).toBe(game);
  });

  it('rejects a repeated guess without adding it', () => {
    const first = submitGuess(newGame(), '1243', 2000).state;
    const result = submitGuess(first, '1243', 3000);
    expect(result.status).toBe('duplicate');
    expect(result.state.history).toHaveLength(1);
  });

  it('treats a hex guess in other case as a repeat', () => {
    const game = createGame({ length: 2, base: 16 }, 'a1', 0);
    const first = submitGuess(game, 'B2', 10).state;
    expect(submitGuess(first, 'b2', 20).status).toBe('duplicate');
  });

  it('accepts uppercase hex input', () => {
    const game = createGame({ length: 2, base: 16 }, 'a1', 0);
    const { state, status } = submitGuess(game, 'A1', 10);
    expect(status).toBe('accepted');
    expect(state.history[0]).toEqual({ guess: 'a1', bulls: 2, cows: 0 });
  });

  it('finishes the game when all digits are bulls', () => {
    const { state } = submitGuess(newGame(), '1234', 5000);
    expect(state.finishedAt).toBe(5000);
  });

  it('ignores guesses after the game is finished', () => {
    const won = submitGuess(newGame(), '1234', 5000).state;
    const result = submitGuess(won, '5678', 6000);
    expect(result.status).toBe('finished');
    expect(result.state).toBe(won);
  });
});

describe('getResult', () => {
  it('returns null while the game is in progress', () => {
    expect(getResult(newGame())).toBeNull();
  });

  it('returns attempts and elapsed time after a win', () => {
    const first = submitGuess(newGame(), '5678', 2000).state;
    const won = submitGuess(first, '1234', 4500).state;
    expect(getResult(won)).toEqual({ attempts: 2, timeMs: 3500 });
  });
});

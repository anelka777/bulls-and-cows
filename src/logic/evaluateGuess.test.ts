import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';

describe('evaluateGuess', () => {
  it('returns all bulls when the guess equals the secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns all cows when every digit is misplaced', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '1357')).toEqual({ bulls: 1, cows: 1 });
  });

  it('returns zeros when there are no common digits', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('counts a single bull', () => {
    expect(evaluateGuess('1234', '1567')).toEqual({ bulls: 1, cows: 0 });
  });

  it('counts cows without bulls', () => {
    expect(evaluateGuess('1234', '5127')).toEqual({ bulls: 0, cows: 2 });
  });

  it('handles a leading zero in the secret', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('ignores letter case for hex digits', () => {
    expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('a1b2', 'B2A1')).toEqual({ bulls: 0, cows: 4 });
    expect(evaluateGuess('A1B2', 'a1c3')).toEqual({ bulls: 2, cows: 0 });
  });

  it('works for binary numbers', () => {
    expect(evaluateGuess('01', '01')).toEqual({ bulls: 2, cows: 0 });
    expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
  });
});

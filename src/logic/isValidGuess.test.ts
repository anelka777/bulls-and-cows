import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess.js';

describe('isValidGuess', () => {
  it('accepts a guess with correct length, valid digits and no repeats', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('accepts a leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects a guess that is too short', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
  });

  it('rejects a guess that is too long', () => {
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('rejects an empty guess', () => {
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
  });

  it('rejects digits outside the base', () => {
    expect(isValidGuess('12', 2, 2)).toBe(false);
    expect(isValidGuess('1a', 2, 10)).toBe(false);
    expect(isValidGuess('1g', 2, 16)).toBe(false);
  });

  it('accepts valid binary and hex guesses', () => {
    expect(isValidGuess('10', 2, 2)).toBe(true);
    expect(isValidGuess('a3f', 3, 16)).toBe(true);
  });

  it('accepts uppercase hex digits', () => {
    expect(isValidGuess('A3F', 3, 16)).toBe(true);
  });

  it('treats the same hex digit in different case as a repeat', () => {
    expect(isValidGuess('aA', 2, 16)).toBe(false);
  });

  it('rejects spaces and symbols', () => {
    expect(isValidGuess('1 3', 3, 10)).toBe(false);
    expect(isValidGuess('1-3', 3, 10)).toBe(false);
  });
});

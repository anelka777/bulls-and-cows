import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';

describe('countPossibleSecrets', () => {
  it('counts permutations for decimal', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(6, 10)).toBe(151200);
  });

  it('counts permutations for binary', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('counts permutations for octal', () => {
    expect(countPossibleSecrets(3, 8)).toBe(336);
  });

  it('counts permutations for hex', () => {
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  it('returns 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns base for length 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('returns 0 when length exceeds base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('follows the recursive relation f(l, b) = b * f(l - 1, b - 1)', () => {
    for (const [length, base] of [
      [2, 10],
      [4, 16],
      [3, 8],
      [2, 2],
    ]) {
      expect(countPossibleSecrets(length, base)).toBe(
        base * countPossibleSecrets(length - 1, base - 1),
      );
    }
  });

  it('returns the same result on repeated calls', () => {
    expect(countPossibleSecrets(4, 10)).toBe(countPossibleSecrets(4, 10));
  });
});

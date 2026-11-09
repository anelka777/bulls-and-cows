import { describe, expect, it, vi } from 'vitest';
import { generateSecret } from './generateSecret.js';
import { isValidGuess } from './isValidGuess.js';

const fromList = (values: number[]) => {
  let index = 0;
  return () => values[index++];
};

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('generateSecret', () => {
  it('returns a string of the requested length', () => {
    const secret = generateSecret(4, 10, () => 0);
    expect(typeof secret).toBe('string');
    expect(secret).toHaveLength(4);
  });

  it('takes the lowest digits first when random returns 0 (leading zero kept)', () => {
    expect(generateSecret(4, 10, () => 0)).toBe('0123');
  });

  it('takes the highest digits first when random is close to 1', () => {
    expect(generateSecret(4, 10, () => 0.999)).toBe('9876');
  });

  it('follows the sequence of values given by random', () => {
    expect(generateSecret(3, 10, fromList([0.5, 0, 0.99]))).toBe('509');
  });

  it('calls random exactly once per digit', () => {
    const random = vi.fn(() => 0);
    generateSecret(4, 10, random);
    expect(random).toHaveBeenCalledTimes(4);
  });

  it('always produces unique valid digits for every base and length', () => {
    for (const base of [2, 8, 10, 16]) {
      for (let length = 2; length <= Math.min(6, base); length++) {
        for (let seed = 1; seed <= 20; seed++) {
          const secret = generateSecret(length, base, seeded(seed));
          expect(isValidGuess(secret, length, base)).toBe(true);
        }
      }
    }
  });

  it('uses all digits when length equals base', () => {
    const secret = generateSecret(2, 2, seeded(7));
    expect([...secret].sort()).toEqual(['0', '1']);
  });

  it('works with the default Math.random', () => {
    const secret = generateSecret(4, 10);
    expect(isValidGuess(secret, 4, 10)).toBe(true);
  });

  it('throws RangeError when length is greater than base', () => {
    expect(() => generateSecret(3, 2, () => 0)).toThrow(RangeError);
  });

  it('throws RangeError when base is greater than 16', () => {
    expect(() => generateSecret(4, 17, () => 0)).toThrow(RangeError);
  });
});

import { describe, expect, it } from 'vitest';
import { availableLengths, clampLength } from './settings.js';

describe('availableLengths', () => {
  it('allows only length 2 for binary', () => {
    expect(availableLengths(2)).toEqual([2]);
  });

  it('allows lengths 2-6 for octal, decimal and hex', () => {
    expect(availableLengths(8)).toEqual([2, 3, 4, 5, 6]);
    expect(availableLengths(10)).toEqual([2, 3, 4, 5, 6]);
    expect(availableLengths(16)).toEqual([2, 3, 4, 5, 6]);
  });
});

describe('clampLength', () => {
  it('reduces a too long length to the maximum available', () => {
    expect(clampLength(5, 2)).toBe(2);
  });

  it('keeps a length that is already available', () => {
    expect(clampLength(4, 10)).toBe(4);
    expect(clampLength(2, 16)).toBe(2);
  });
});

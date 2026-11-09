import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('returns the same result as the original function', () => {
    const add = memoize((a: number, b: number) => a + b);
    expect(add(2, 3)).toBe(5);
  });

  it('calls the original function once for repeated arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const add = memoize(fn);
    add(2, 3);
    add(2, 3);
    add(2, 3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const add = memoize(fn);
    expect(add(2, 3)).toBe(5);
    expect(add(1, 1)).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('uses a custom key function when provided', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const add = memoize(fn, (a, b) => `${Math.min(a, b)},${Math.max(a, b)}`);
    add(2, 3);
    add(3, 2);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

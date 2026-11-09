import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './createDigitValidator.js';

describe('createDigitValidator', () => {
  it('accepts only 0 and 1 for binary', () => {
    const isDigit = createDigitValidator(2);
    expect(isDigit('0')).toBe(true);
    expect(isDigit('1')).toBe(true);
    expect(isDigit('2')).toBe(false);
  });

  it('accepts 0-7 for octal', () => {
    const isDigit = createDigitValidator(8);
    expect(isDigit('7')).toBe(true);
    expect(isDigit('8')).toBe(false);
  });

  it('accepts 0-9 for decimal and rejects letters', () => {
    const isDigit = createDigitValidator(10);
    expect(isDigit('9')).toBe(true);
    expect(isDigit('a')).toBe(false);
  });

  it('accepts 0-9 and a-f for hex', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('0')).toBe(true);
    expect(isDigit('f')).toBe(true);
    expect(isDigit('g')).toBe(false);
  });

  it('treats hex digits case-insensitively', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('a')).toBe(true);
    expect(isDigit('A')).toBe(true);
    expect(isDigit('F')).toBe(true);
  });

  it('rejects empty strings, multi-char strings and symbols', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('')).toBe(false);
    expect(isDigit('10')).toBe(false);
    expect(isDigit('-')).toBe(false);
    expect(isDigit(' ')).toBe(false);
  });

  it('returns independent validators for different bases', () => {
    const bin = createDigitValidator(2);
    const dec = createDigitValidator(10);
    expect(bin('5')).toBe(false);
    expect(dec('5')).toBe(true);
  });
});

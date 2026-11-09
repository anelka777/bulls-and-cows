import { DIGITS } from './createDigitValidator.js';

const pickDigits = (
  pool: readonly string[],
  count: number,
  random: () => number,
): string[] => {
  if (count === 0) {
    return [];
  }
  const index = Math.floor(random() * pool.length);
  const rest = pool.filter((_, i) => i !== index);
  return [pool[index], ...pickDigits(rest, count - 1, random)];
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (base > DIGITS.length || length > base) {
    throw new RangeError(
      `Cannot build a secret of ${length} unique digits in base ${base}`,
    );
  }
  return pickDigits([...DIGITS.slice(0, base)], length, random).join('');
};

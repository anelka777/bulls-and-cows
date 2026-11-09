import { createDigitValidator } from './createDigitValidator.js';

export const isValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  const chars = [...guess.toLowerCase()];
  const isDigit = createDigitValidator(base);

  return (
    chars.length === length &&
    chars.every(isDigit) &&
    new Set(chars).size === length
  );
};

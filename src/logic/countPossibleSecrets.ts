import { memoize } from './memoize.js';

const countRecursive = (length: number, base: number): number => {
  if (length > base) {
    return 0;
  }
  if (length === 0) {
    return 1;
  }
  return base * countPossibleSecrets(length - 1, base - 1);
};

export const countPossibleSecrets = memoize(countRecursive);

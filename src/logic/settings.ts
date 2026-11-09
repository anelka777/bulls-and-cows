export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

export const BASES = [
  { label: 'bin', base: 2 },
  { label: 'oct', base: 8 },
  { label: 'dec', base: 10 },
  { label: 'hex', base: 16 },
] as const;

export const availableLengths = (base: number): number[] =>
  Array.from(
    { length: MAX_LENGTH - MIN_LENGTH + 1 },
    (_, i) => MIN_LENGTH + i,
  ).filter((length) => length <= base);

export const clampLength = (length: number, base: number): number =>
  Math.min(length, Math.max(...availableLengths(base)));

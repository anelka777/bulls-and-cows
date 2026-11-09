import type { Settings } from './game.js';

export type GameRecord = { attempts: number; timeMs: number; date: number };

export const TOP_N = 10;

export const recordsKey = ({ length, base }: Settings): string =>
  `bulls-and-cows:records:${length}:${base}`;

const byAttemptsThenTime = (a: GameRecord, b: GameRecord): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const addRecord = (
  records: readonly GameRecord[],
  record: GameRecord,
  topN: number = TOP_N,
): GameRecord[] => [...records, record].sort(byAttemptsThenTime).slice(0, topN);

const isRecord = (value: unknown): value is GameRecord =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as GameRecord).attempts === 'number' &&
  typeof (value as GameRecord).timeMs === 'number' &&
  typeof (value as GameRecord).date === 'number';

export const parseRecords = (json: string | null): GameRecord[] => {
  if (json === null) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(json);
    return Array.isArray(data) ? data.filter(isRecord) : [];
  } catch {
    return [];
  }
};

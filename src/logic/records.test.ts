import { describe, expect, it } from 'vitest';
import { addRecord, parseRecords, recordsKey } from './records.js';

const rec = (attempts: number, timeMs: number) => ({
  attempts,
  timeMs,
  date: 0,
});

describe('addRecord', () => {
  it('sorts by number of attempts', () => {
    const result = addRecord([rec(8, 1000), rec(3, 5000)], rec(5, 2000));
    expect(result.map((r) => r.attempts)).toEqual([3, 5, 8]);
  });

  it('breaks ties by time', () => {
    const result = addRecord([rec(4, 9000)], rec(4, 3000));
    expect(result.map((r) => r.timeMs)).toEqual([3000, 9000]);
  });

  it('keeps only the top N records', () => {
    const result = addRecord([rec(1, 1), rec(2, 1), rec(3, 1)], rec(4, 1), 3);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.attempts)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original list', () => {
    const original = [rec(5, 1000)];
    const result = addRecord(original, rec(2, 500));
    expect(original).toHaveLength(1);
    expect(result).not.toBe(original);
  });
});

describe('recordsKey', () => {
  it('gives a separate key for every length/base pair', () => {
    expect(recordsKey({ length: 4, base: 10 })).not.toBe(
      recordsKey({ length: 4, base: 16 }),
    );
    expect(recordsKey({ length: 4, base: 10 })).not.toBe(
      recordsKey({ length: 5, base: 10 }),
    );
  });
});

describe('parseRecords', () => {
  it('returns an empty list for null and broken JSON', () => {
    expect(parseRecords(null)).toEqual([]);
    expect(parseRecords('not json')).toEqual([]);
  });

  it('returns an empty list when JSON is not an array', () => {
    expect(parseRecords('{"a":1}')).toEqual([]);
  });

  it('parses valid records and drops invalid ones', () => {
    const json = JSON.stringify([rec(3, 1000), { attempts: 'x' }]);
    expect(parseRecords(json)).toEqual([rec(3, 1000)]);
  });
});

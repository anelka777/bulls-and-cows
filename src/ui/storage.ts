import type { Settings } from '../logic/game.js';
import {
  addRecord,
  parseRecords,
  recordsKey,
  type GameRecord,
} from '../logic/records.js';

export const loadRecords = (settings: Settings): GameRecord[] => {
  try {
    return parseRecords(localStorage.getItem(recordsKey(settings)));
  } catch {
    return [];
  }
};

export const saveRecord = (
  settings: Settings,
  record: GameRecord,
): GameRecord[] => {
  const updated = addRecord(loadRecords(settings), record);
  try {
    localStorage.setItem(recordsKey(settings), JSON.stringify(updated));
  } catch {
    // storage is unavailable: the game still works, records just are not kept
  }
  return updated;
};

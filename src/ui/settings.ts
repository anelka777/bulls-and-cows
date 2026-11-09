import { countPossibleSecrets } from '../logic/countPossibleSecrets.js';
import type { Settings } from '../logic/game.js';
import {
  BASES,
  MAX_LENGTH,
  MIN_LENGTH,
  availableLengths,
  clampLength,
} from '../logic/settings.js';
import { el } from './dom.js';

const ALL_LENGTHS = Array.from(
  { length: MAX_LENGTH - MIN_LENGTH + 1 },
  (_, i) => MIN_LENGTH + i,
);

export const renderSettings = (
  initial: Settings,
  onStart: (settings: Settings) => void,
): HTMLElement => {
  const baseSelect = el(
    'select',
    { attrs: { id: 'base' } },
    ...BASES.map(({ label, base }) =>
      el('option', {
        text: `${label} (${base})`,
        attrs: { value: String(base) },
      }),
    ),
  );
  baseSelect.value = String(initial.base);

  const lengthSelect = el('select', { attrs: { id: 'length' } });
  const info = el('p', { className: 'hint' });

  const refresh = (): void => {
    const base = Number(baseSelect.value);
    const current = Number(lengthSelect.value) || initial.length;
    const length = clampLength(current, base);
    const available = availableLengths(base);

    lengthSelect.replaceChildren(
      ...ALL_LENGTHS.map((value) =>
        el('option', {
          text: String(value),
          attrs: {
            value: String(value),
            ...(available.includes(value) ? {} : { disabled: '' }),
          },
        }),
      ),
    );
    lengthSelect.value = String(length);
    info.textContent = `Возможных секретных чисел: ${countPossibleSecrets(length, base)}`;
  };

  baseSelect.addEventListener('change', refresh);
  lengthSelect.addEventListener('change', refresh);
  refresh();

  const startButton = el('button', {
    text: 'Начать игру',
    on: {
      click: () =>
        onStart({
          length: Number(lengthSelect.value),
          base: Number(baseSelect.value),
        }),
    },
  });

  return el(
    'section',
    { className: 'screen' },
    el('h1', { text: 'Bulls and Cows' }),
    el('label', { text: 'Система счисления', attrs: { for: 'base' } }),
    baseSelect,
    el('label', { text: 'Длина секретного числа', attrs: { for: 'length' } }),
    lengthSelect,
    info,
    startButton,
  );
};

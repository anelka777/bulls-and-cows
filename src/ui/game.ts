import { createDigitValidator } from '../logic/createDigitValidator.js';
import { getResult, submitGuess, type GameState } from '../logic/game.js';
import type { GameRecord } from '../logic/records.js';
import { BASES } from '../logic/settings.js';
import { el } from './dom.js';

type GameHandlers = {
  records: GameRecord[];
  onWin: (record: GameRecord) => GameRecord[];
  onNewGame: () => void;
};

const formatTime = (ms: number): string => `${(ms / 1000).toFixed(1)} с`;

export const renderGame = (
  initial: GameState,
  handlers: GameHandlers,
): HTMLElement => {
  let state = initial;
  const { length, base } = state.settings;
  const isDigit = createDigitValidator(base);
  const baseLabel =
    BASES.find((item) => item.base === base)?.label ?? `${base}`;

  const input = el('input', {
    attrs: {
      type: 'text',
      maxlength: String(length),
      autocomplete: 'off',
      autocapitalize: 'off',
      placeholder: `${length} разных цифр`,
      'aria-label': 'Ваша попытка',
    },
  });
  const form = el(
    'form',
    { className: 'guess-form' },
    input,
    el('button', { text: 'Угадать', attrs: { type: 'submit' } }),
  );
  const message = el('p', { className: 'message', attrs: { role: 'status' } });
  const history = el('ol', { className: 'history' });
  const recordsBox = el('div', { className: 'records' });

  const showHistory = (): void => {
    history.replaceChildren(
      ...state.history.map((attempt) =>
        el('li', {
          text: `${attempt.guess.toUpperCase()}: быки ${attempt.bulls}, коровы ${attempt.cows}`,
        }),
      ),
    );
  };

  const showRecords = (
    list: readonly GameRecord[],
    current?: GameRecord,
  ): void => {
    recordsBox.replaceChildren(
      el('h2', { text: `Рекорды (${baseLabel}, длина ${length})` }),
      list.length === 0
        ? el('p', { className: 'hint', text: 'Пока нет результатов.' })
        : el(
            'ol',
            {},
            ...list.map((item) =>
              el('li', {
                className: item === current ? 'current' : '',
                text: `${item.attempts} поп., ${formatTime(item.timeMs)}`,
              }),
            ),
          ),
    );
  };

  const showWin = (): void => {
    const result = getResult(state);
    if (result === null) {
      return;
    }
    const record: GameRecord = { ...result, date: Date.now() };
    const updated = handlers.onWin(record);
    form.replaceWith(
      el('p', {
        className: 'win',
        text: `Победа! Попыток: ${result.attempts}, время: ${formatTime(result.timeMs)}`,
      }),
    );
    message.textContent = '';
    showRecords(updated, record);
  };

  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isDigit).join('').slice(0, length);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = submitGuess(state, input.value, Date.now());
    state = result.state;

    if (result.status === 'invalid') {
      message.textContent = `Введите ${length} разных цифр системы ${baseLabel}.`;
    } else if (result.status === 'duplicate') {
      message.textContent = 'Такая попытка уже была.';
    } else if (result.status === 'accepted') {
      message.textContent = '';
      input.value = '';
    }

    showHistory();
    if (result.status === 'accepted' && state.finishedAt !== null) {
      showWin();
    } else {
      input.focus();
    }
  });

  showHistory();
  showRecords(handlers.records);

  return el(
    'section',
    { className: 'screen' },
    el('h1', { text: 'Bulls and Cows' }),
    el('p', {
      className: 'hint',
      text: `Система: ${baseLabel} (${base}), длина: ${length}`,
    }),
    form,
    message,
    el('h2', { text: 'Попытки' }),
    history,
    recordsBox,
    el('button', {
      text: 'Новая игра',
      on: { click: handlers.onNewGame },
    }),
  );
};

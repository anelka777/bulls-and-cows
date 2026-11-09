import { evaluateGuess, type Feedback } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';

export type Settings = { length: number; base: number };
export type Attempt = { guess: string } & Feedback;

export type GameState = {
  readonly settings: Settings;
  readonly secret: string;
  readonly history: readonly Attempt[];
  readonly startedAt: number;
  readonly finishedAt: number | null;
};

export type SubmitStatus = 'accepted' | 'invalid' | 'duplicate' | 'finished';
export type SubmitResult = { state: GameState; status: SubmitStatus };

export const createGame = (
  settings: Settings,
  secret: string,
  now: number,
): GameState => ({
  settings,
  secret: secret.toLowerCase(),
  history: [],
  startedAt: now,
  finishedAt: null,
});

export const submitGuess = (
  state: GameState,
  rawGuess: string,
  now: number,
): SubmitResult => {
  const { length, base } = state.settings;
  const guess = rawGuess.toLowerCase();

  if (state.finishedAt !== null) {
    return { state, status: 'finished' };
  }
  if (!isValidGuess(guess, length, base)) {
    return { state, status: 'invalid' };
  }
  if (state.history.some((attempt) => attempt.guess === guess)) {
    return { state, status: 'duplicate' };
  }

  const feedback = evaluateGuess(state.secret, guess);
  return {
    state: {
      ...state,
      history: [...state.history, { guess, ...feedback }],
      finishedAt: feedback.bulls === length ? now : null,
    },
    status: 'accepted',
  };
};

export const getResult = (
  state: GameState,
): { attempts: number; timeMs: number } | null =>
  state.finishedAt === null
    ? null
    : {
        attempts: state.history.length,
        timeMs: state.finishedAt - state.startedAt,
      };

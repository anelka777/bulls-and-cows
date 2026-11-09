import { createGame, type Settings } from './logic/game.js';
import { generateSecret } from './logic/generateSecret.js';
import { el } from './ui/dom.js';
import { renderGame } from './ui/game.js';
import { renderSettings } from './ui/settings.js';
import { loadRecords, saveRecord } from './ui/storage.js';

let lastSettings: Settings = { length: 4, base: 10 };

const app = el('main', { attrs: { id: 'app' } });
document.body.append(app);

const showSettings = (): void => {
  app.replaceChildren(renderSettings(lastSettings, startGame));
};

const startGame = (settings: Settings): void => {
  lastSettings = settings;
  const secret = generateSecret(settings.length, settings.base);
  const game = createGame(settings, secret, Date.now());
  app.replaceChildren(
    renderGame(game, {
      records: loadRecords(settings),
      onWin: (record) => saveRecord(settings, record),
      onNewGame: showSettings,
    }),
  );
};

showSettings();

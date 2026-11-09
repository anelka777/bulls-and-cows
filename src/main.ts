import type { Settings } from './logic/game.js';
import { el } from './ui/dom.js';
import { renderSettings } from './ui/settings.js';

const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };

const app = el('main', { attrs: { id: 'app' } });
document.body.append(app);

const showSettings = (): void => {
  app.replaceChildren(
    renderSettings(DEFAULT_SETTINGS, (settings) => {
      app.replaceChildren(
        el('p', {
          text: `Старт: длина ${settings.length}, основание ${settings.base}`,
        }),
      );
    }),
  );
};

showSettings();

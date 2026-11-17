import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { createLocalization } from './lib/i18n';
import { getSeo } from './lib/seo';
import App from './App';
import type { Language } from './types/property';
import { basePath } from './lib/urls';

export async function render(language: Language) {
  const i18n = await createLocalization(language);
  return {
    basePath,
    html: renderToString(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    ),
    seo: getSeo(language),
  };
}

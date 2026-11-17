import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { createLocalization } from './lib/i18n';
import App from './App';
import './index.css';
import { basePath, languagePath, pathLanguage } from './lib/urls';

// Match the prerendered document before hydrating. A stored English preference
// uses the existing English HTML instead of changing language mid-hydration.
let preferredPath: string | undefined;
try {
  if (
    window.location.pathname === basePath &&
    localStorage.getItem('bananov-rai-language') === 'en'
  )
    preferredPath = languagePath('en', window.location.hash);
} catch {
  /* Optional preference; explicit routes always work without storage. */
}

if (preferredPath) window.location.replace(preferredPath);
else {
  const i18n = await createLocalization(pathLanguage(window.location.pathname));
  const element = (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StrictMode>
  );
  const root = document.getElementById('root')!;
  if (root.querySelector('main')) hydrateRoot(root, element);
  else createRoot(root).render(element);
}

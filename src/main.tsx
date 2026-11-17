import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { createLocalization } from './lib/i18n';
import App from './App';
import './index.css';

const i18n = await createLocalization(window.location.pathname.startsWith('/en') ? 'en' : 'bg');
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

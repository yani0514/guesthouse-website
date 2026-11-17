import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import bg from '../locales/bg.json';
import en from '../locales/en.json';
import type { Language } from '../types/property';

export async function createLocalization(language: Language) {
  const instance = createInstance();
  await instance.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'bg',
    supportedLngs: ['bg', 'en'],
    resources: { bg: { translation: bg }, en: { translation: en } },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}

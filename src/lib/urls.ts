import type { Language } from '../types/property';

export const basePath = import.meta.env.BASE_URL;
const siteOrigin = 'https://yani0514.github.io';

/** Accept portable public paths or already-prefixed paths without doubling the mount point. */
export function publicPath(path: string): string {
  if (path.startsWith(basePath)) return path;
  return `${basePath}${path.replace(/^\/+/, '')}`;
}

export function languagePath(language: Language, hash = ''): string {
  return `${publicPath(`${language}/`)}${hash}`;
}

export function pathLanguage(pathname: string): Language {
  return pathname === languagePath('en') || pathname === languagePath('en').slice(0, -1)
    ? 'en'
    : 'bg';
}

export function canonicalUrl(path = ''): string {
  return new URL(publicPath(path), siteOrigin).href;
}

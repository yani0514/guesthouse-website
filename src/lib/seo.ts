import { property } from '../data/property';
import bg from '../locales/bg.json';
import en from '../locales/en.json';
import type { Language } from '../types/property';
import { canonicalUrl } from './urls';
import { contactLinks } from './contact';

export function getSeo(language: Language) {
  const text = language === 'bg' ? bg.seo : en.seo;
  const origin = canonicalUrl().replace(/\/$/, '');
  const contact = contactLinks(property.contact);
  return {
    ...text,
    url: canonicalUrl(`${language}/`),
    origin,
    image: canonicalUrl('social.jpg'),
    locale: language === 'bg' ? 'bg_BG' : 'en_GB',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: language === 'bg' ? property.fullNameBg : property.fullNameEn,
      description: text.description,
      url: canonicalUrl(`${language}/`),
      image: canonicalUrl('social.jpg'),
      ...(contact.phone ? { telephone: contact.phone } : {}),
      ...(contact.email ? { email: contact.email } : {}),
    },
  };
}

export function updateSeo(language: Language) {
  const seo = getSeo(language);
  document.documentElement.lang = language;
  document.title = seo.title;
  const values: Record<string, string> = {
    description: seo.description,
    'og:title': seo.title,
    'og:description': seo.description,
    'og:locale': seo.locale,
    'og:image': seo.image,
    'twitter:title': seo.title,
    'twitter:description': seo.description,
    'twitter:image': seo.image,
    ...(seo.url ? { 'og:url': seo.url } : {}),
  };
  for (const [key, value] of Object.entries(values)) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      document.head.append(meta);
    }
    meta.content = value;
  }
  if (seo.url) {
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = seo.url;
  }
  const schema = document.querySelector('#property-schema');
  if (schema) schema.textContent = JSON.stringify(seo.structuredData);
}

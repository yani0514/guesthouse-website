import type { ContactConfig } from '../types/property';

export function internationalPhone(value?: string): string | undefined {
  const phone = value?.trim().replace(/[\s()-]/g, '');
  return phone && /^\+[1-9]\d{7,14}$/.test(phone) ? phone : undefined;
}

export function contactLinks(contact: ContactConfig, mapsDestination?: string) {
  const phone = internationalPhone(contact.phone) ?? internationalPhone(contact.viber);
  const viber = internationalPhone(contact.viber);
  const email = contact.email?.trim();
  const validEmail =
    email && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(email);
  let facebook: string | undefined;
  try {
    const url = new URL(contact.facebook ?? '');
    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.me'].includes(url.hostname)
    )
      facebook = url.href;
  } catch {
    /* Missing or invalid optional contact: no public link. */
  }
  return {
    phone,
    tel: phone ? `tel:${phone}` : undefined,
    email: validEmail ? email : undefined,
    mailto: validEmail ? `mailto:${encodeURIComponent(email).replace('%40', '@')}` : undefined,
    viber: viber ? `viber://chat?number=${encodeURIComponent(viber)}` : undefined,
    facebook,
    maps: mapsDestination?.trim()
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsDestination.trim())}`
      : undefined,
  };
}

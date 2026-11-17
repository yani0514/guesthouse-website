import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { property } from '../../data/property';
import { LeafMark } from '../ui/Brand';
import { contactLinks } from '../../lib/contact';

export function Contact() {
  const { t } = useTranslation();
  const { contact, location } = property;
  const links = contactLinks(contact, location.mapsDestination);
  const hasContact = Boolean(links.tel || links.mailto || links.viber || links.facebook);
  return (
    <section
      id="contact"
      tabIndex={-1}
      className="section wrap contact-grid"
      aria-labelledby="contact-title"
    >
      <div>
        <p className="eyebrow">{t('contact.eyebrow')}</p>
        <h2 id="contact-title">
          {t('contact.title')} <em>{t('contact.accent')}</em>
        </h2>
        <p className="contact-intro">{t('contact.description')}</p>
        {!hasContact && <p className="contact-pending">{t('contact.pending')}</p>}
        <div className="contact-actions">
          {links.tel && (
            <a
              href={links.tel}
              className="contact-action"
            >
              <Phone />
              <span>
                <small>{t('contact.phone')}</small>
                <strong>{links.phone}</strong>
              </span>
              <ArrowUpRight />
            </a>
          )}
          {links.mailto && (
            <a
              href={links.mailto}
              className="contact-action"
            >
              <Mail />
              <span>
                <small>{t('contact.email')}</small>
                <strong>{links.email}</strong>
              </span>
              <ArrowUpRight />
            </a>
          )}
          {links.viber && (
            <div>
              <a
                href={links.viber}
                className="text-link"
              >
                <MessageCircle size={20} />
                {t('contact.viber')}
                <ArrowUpRight size={18} />
              </a>
              <p className="small-note">{t('contact.viberHint')}</p>
            </div>
          )}
          {links.facebook && (
            <a
              href={links.facebook}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('contact.facebook')}
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>
      </div>
      <div className="location-panel">
        <LeafMark className="location-leaf" />
        <MapPin size={25} />
        <h3>{t('contact.locationTitle')}</h3>
        <p className="location-text">{t('common.location')}</p>
        {location.address ? <p>{location.address}</p> : <p>{t('contact.locationNote')}</p>}
        {links.maps && (
          <a
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
            href={links.maps}
          >
            {t('contact.directions')}
            <ArrowUpRight size={18} />
          </a>
        )}
        <div className="direct-note">
          <strong>{t('contact.direct')}</strong>
          <p>{t('contact.directText')}</p>
        </div>
      </div>
    </section>
  );
}

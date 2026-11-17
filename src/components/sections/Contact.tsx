import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { property } from '../../data/property';
import { LeafMark } from '../ui/Brand';

export function Contact() {
  const { t } = useTranslation();
  const { contact, location } = property;
  const phone = contact.phone || contact.viber;
  const hasContact = Boolean(contact.phone || contact.email || contact.viber || contact.facebook);
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
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="contact-action"
            >
              <Phone />
              <span>
                <small>{t('contact.phone')}</small>
                <strong>{phone}</strong>
              </span>
              <ArrowUpRight />
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="contact-action"
            >
              <Mail />
              <span>
                <small>{t('contact.email')}</small>
                <strong>{contact.email}</strong>
              </span>
              <ArrowUpRight />
            </a>
          )}
          {contact.viber && (
            <div>
              <a
                href={`viber://chat?number=${encodeURIComponent(contact.viber.replace(/\s/g, ''))}`}
                className="text-link"
              >
                <MessageCircle size={20} />
                {t('contact.viber')}
                <ArrowUpRight size={18} />
              </a>
              <p className="small-note">{t('contact.viberHint')}</p>
            </div>
          )}
          {contact.facebook && (
            <a
              href={contact.facebook}
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
        {location.mapsDestination && (
          <a
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.mapsDestination)}`}
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

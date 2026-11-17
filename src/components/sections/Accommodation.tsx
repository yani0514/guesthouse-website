import { BedDouble, Bath, Users, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { property } from '../../data/property';
import { getImage } from '../../data/gallery';
import { Photo } from '../ui/Photo';

export function Accommodation() {
  const { t } = useTranslation();
  return (
    <section
      id="accommodation"
      tabIndex={-1}
      className="section accommodation"
      aria-labelledby="accommodation-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('accommodation.eyebrow')}</p>
            <h2 id="accommodation-title">{t('accommodation.title')}</h2>
          </div>
          <p>{t('accommodation.intro')}</p>
        </div>
        <div className="floor-grid">
          {property.floors.map((floor) => (
            <article
              className="floor"
              key={floor.id}
            >
              <div className="floor-top">
                <span className="floor-number">0{floor.number}</span>
                <span className="guest-label">
                  <Users size={15} />
                  {t('accommodation.capacity', { count: floor.capacity })}
                </span>
              </div>
              <h3>{t(`accommodation.${floor.id}`)}</h3>
              <ul>
                <li>
                  <BedDouble size={20} />
                  <span>
                    {t(`accommodation.${floor.id === 'first' ? 'firstBeds' : 'upperBeds'}`)}
                  </span>
                </li>
                <li>
                  <Bath size={20} />
                  <span>
                    {t(`accommodation.${floor.id === 'first' ? 'firstBath' : 'upperBath'}`)}
                  </span>
                </li>
              </ul>
              <p>{t(`accommodation.${floor.id === 'first' ? 'firstNote' : 'upperNote'}`)}</p>
            </article>
          ))}
        </div>
        {property.capacityProvisional && <p className="capacity-note">{t('common.approximate')}</p>}
        <div className="room-photos">
          <Photo
            image={getImage('bedroom-double-sofa')}
            sizes="(min-width: 800px) 38vw, 60vw"
          />
          <Photo
            image={getImage('bedroom-twin-beds')}
            sizes="(min-width: 800px) 38vw, 60vw"
          />
          <Photo
            image={getImage('bathroom-mosaic')}
            sizes="(min-width: 800px) 20vw, 35vw"
          />
        </div>
        <div className="room-photo-footer">
          <p>{t('accommodation.photoNote')}</p>
          <a
            href="#gallery"
            className="text-link"
          >
            {t('accommodation.roomsLink')}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

import { CarFront, Wifi, Tv, Flame, CircleDot, Trees, CookingPot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Photo } from '../ui/Photo';
import { getImage } from '../../data/gallery';
import { property } from '../../data/property';

const features = [
  { key: 'pool', image: 'pool-sun-loungers' },
  { key: 'mehana', image: 'mehana-brick-barbecue' },
  { key: 'terrace', image: 'terrace-parasols' },
];
const amenities = [
  { key: 'parking', Icon: CarFront },
  { key: 'wifi', Icon: Wifi },
  { key: 'tv', Icon: Tv },
  { key: 'barbecue', Icon: Flame },
  { key: 'trampoline', Icon: CircleDot },
  { key: 'garden', Icon: Trees },
];

export function Amenities() {
  const { t } = useTranslation();
  return (
    <section
      id="amenities"
      tabIndex={-1}
      className="section amenities-section"
      aria-labelledby="amenities-title"
    >
      <div className="wrap">
        <p className="eyebrow">{t('amenities.eyebrow')}</p>
        <h2 id="amenities-title">
          {t('amenities.title')} <em>{t('amenities.accent')}</em>
        </h2>
        <div className="amenity-features">
          {features.map(({ key, image }, index) => (
            <article key={key}>
              <div className="feature-photo">
                <Photo
                  image={getImage(image)}
                  sizes="(min-width: 800px) 31vw, 90vw"
                />
                <span>0{index + 1}</span>
              </div>
              <h3>{t(`amenities.${key}Title`)}</h3>
              <p>{t(`amenities.${key}Text`)}</p>
            </article>
          ))}
        </div>
        <ul className="amenity-list">
          {amenities.map(({ key, Icon }) => (
            <li key={key}>
              <Icon size={22} />
              <span>{t(`amenities.${key}`)}</span>
            </li>
          ))}
          {property.kitchenAvailableToGuests && (
            <li>
              <CookingPot size={22} />
              <span>{t('amenities.kitchen')}</span>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

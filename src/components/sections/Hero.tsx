import { ArrowDown, ArrowUpRight, BedDouble, MapPin, Users, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Photo } from '../ui/Photo';
import { getImage, heroSizes } from '../../data/gallery';
import { property } from '../../data/property';

export function Hero() {
  const { t } = useTranslation();
  return (
    <>
      <section
        id="home"
        tabIndex={-1}
        className="hero wrap"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {t('hero.eyebrow')}
          </p>
          <h1 id="hero-title">
            {t('hero.title')} <em>{t('hero.titleAccent')}</em>
          </h1>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-buttons">
            <a
              className="button button-primary"
              href="#contact"
            >
              {t('common.contact')}
              <ArrowUpRight size={19} />
            </a>
            <a
              className="text-link"
              href="#gallery"
            >
              {t('common.explore')}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <p className="hero-location">
            <MapPin size={17} />
            {t('common.location')}
          </p>
        </div>
        <div className="hero-visual">
          <Photo
            image={getImage('house-summer-balconies')}
            priority
            sizes={heroSizes}
            position="51% 50%"
          />
          <div className="photo-label">
            <span className="photo-label-number">01</span>
            <span>{t('hero.photoNote')}</span>
            <ArrowUpRight size={20} />
          </div>
          <span
            className="hero-side-note"
            aria-hidden="true"
          >
            BANANOV RAI · TSONEVO
          </span>
        </div>
      </section>
      <div className="fact-strip wrap">
        <span className="scroll-note">
          <ArrowDown size={17} />
          {t('hero.scroll')}
        </span>
        <div>
          <Users />
          <span>{t('common.guests', { count: property.capacity })}</span>
        </div>
        <div>
          <BedDouble />
          <span>{t('common.floors', { count: property.floors.length })}</span>
        </div>
        <div>
          <Waves />
          <span>{t('hero.pool')}</span>
        </div>
      </div>
    </>
  );
}

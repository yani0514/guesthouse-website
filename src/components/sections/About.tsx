import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Photo } from '../ui/Photo';
import { LeafMark } from '../ui/Brand';
import { getImage } from '../../data/gallery';

export function About() {
  const { t } = useTranslation();
  return (
    <section
      id="about"
      tabIndex={-1}
      className="section wrap about-grid"
      aria-labelledby="about-title"
    >
      <div className="about-photos">
        <Photo
          image={getImage('garden-roses-swing')}
          className="about-main"
          sizes="(min-width: 800px) 40vw, 90vw"
        />
        <Photo
          image={getImage('garden-banana-trees')}
          className="about-detail"
          sizes="(min-width: 800px) 240px, 36vw"
        />
        <span className="photo-caption">{t('about.caption')}</span>
      </div>
      <div className="about-copy">
        <p className="eyebrow">{t('about.eyebrow')}</p>
        <h2 id="about-title">
          {t('about.title')} <em>{t('about.accent')}</em>
        </h2>
        <p>{t('about.story')}</p>
        <p>{t('about.detail')}</p>
        <div className="botanical-note">
          <LeafMark />
          <div>
            <strong>{t('about.botanical')}</strong>
            <span>{t('about.botanicalText')}</span>
          </div>
        </div>
        <a
          className="text-link"
          href="#accommodation"
        >
          {t('nav.accommodation')}
          <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}

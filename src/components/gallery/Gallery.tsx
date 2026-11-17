import { lazy, Suspense, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { categories, images } from '../../data/gallery';
import { Photo } from '../ui/Photo';
import type { Category } from '../../types/property';

const Lightbox = lazy(() => import('./Lightbox'));

export function Gallery() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState<'all' | Category>('all');
  const [selected, setSelected] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const filtered =
    category === 'all' ? images : images.filter((image) => image.category === category);
  const language = i18n.language === 'en' ? 'en' : 'bg';
  function close() {
    setSelected(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }
  return (
    <section
      id="gallery"
      tabIndex={-1}
      className="section wrap"
      aria-labelledby="gallery-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('gallery.eyebrow')}</p>
          <h2 id="gallery-title">{t('gallery.title')}</h2>
        </div>
        <p>{t('gallery.intro')}</p>
      </div>
      <div className="gallery-toolbar">
        <div
          className="gallery-filters"
          role="group"
          aria-label={t('gallery.filters')}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {t(`gallery.${item}`)}
            </button>
          ))}
        </div>
        <span
          className="gallery-count"
          aria-live="polite"
        >
          {t('gallery.count', { count: filtered.length })}
        </span>
      </div>
      <div className="gallery-grid">
        {filtered.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`gallery-item ${image.height > image.width ? 'portrait' : ''}`}
            aria-label={t('gallery.open', { caption: image.alt[language] })}
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setSelected(index);
            }}
          >
            <Photo
              image={image}
              sizes="(min-width: 1280px) 405px, (min-width: 768px) 31vw, 47vw"
            />
            <span
              className="gallery-zoom"
              aria-hidden="true"
            >
              <ArrowUpRight size={21} />
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <Suspense fallback={null}>
          <Lightbox
            images={filtered}
            initialIndex={selected}
            onClose={close}
          />
        </Suspense>
      )}
    </section>
  );
}

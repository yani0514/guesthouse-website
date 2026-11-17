import { useTranslation } from 'react-i18next';
import type { PropertyImage } from '../../types/property';

export function Photo({
  image,
  className = '',
  sizes = '(min-width: 1024px) 40vw, 100vw',
  priority = false,
  position = 'center',
}: {
  image: PropertyImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
}) {
  const { i18n } = useTranslation();
  const fallback = image.variants.find((v) => v.width >= 960) ?? image.variants.at(-1)!;
  return (
    <picture className={`photo ${className}`}>
      <source
        type="image/avif"
        srcSet={image.variants.map((v) => `${v.avif} ${v.width}w`).join(', ')}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={image.variants.map((v) => `${v.webp} ${v.width}w`).join(', ')}
        sizes={sizes}
      />
      <img
        src={fallback.jpeg}
        srcSet={image.variants.map((v) => `${v.jpeg} ${v.width}w`).join(', ')}
        sizes={sizes}
        alt={image.alt[i18n.language === 'en' ? 'en' : 'bg']}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ objectPosition: position }}
      />
    </picture>
  );
}

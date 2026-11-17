import data from './images.json' with { type: 'json' };
import type { Category, PropertyImage } from '../types/property';

export const categories: ('all' | Category)[] = [
  'all',
  'house',
  'rooms',
  'mehana',
  'garden',
  'amenities',
];
export const images: PropertyImage[] = data.map((image) => ({
  ...image,
  category: image.category as Category,
  variants: image.widths.map((width) => {
    const stem = `/images/${image.category}/${image.id}-${width}`;
    return { width, avif: `${stem}.avif`, webp: `${stem}.webp`, jpeg: `${stem}.jpg` };
  }),
}));
export const heroSizes = '(min-width: 1400px) 665px, (min-width: 800px) 53vw, calc(100vw - 40px)';
export function getImage(id: string): PropertyImage {
  const image = images.find((item) => item.id === id);
  if (!image) throw new Error(`Missing property image: ${id}`);
  return image;
}

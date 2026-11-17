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
}));
export function getImage(id: string): PropertyImage {
  const image = images.find((item) => item.id === id);
  if (!image) throw new Error(`Missing property image: ${id}`);
  return image;
}

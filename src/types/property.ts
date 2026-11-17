export type Language = 'bg' | 'en';
export type Category = 'house' | 'rooms' | 'mehana' | 'garden' | 'amenities';
export interface PropertyImage {
  id: string;
  source: string;
  category: Category;
  width: number;
  height: number;
  alt: Record<Language, string>;
  variants: { width: number; avif: string; webp: string; jpeg: string }[];
}
export interface FloorConfig {
  id: 'first' | 'second' | 'third';
  number: number;
  capacity: number;
  bedrooms: { singleBeds?: number; doubleBeds?: number; sleepingPlaces: number }[];
  bathrooms: { hasShower: boolean; shared: boolean; servesBedrooms: number }[];
}
export interface ContactConfig {
  phone?: string;
  email?: string;
  viber?: string;
  facebook?: string;
}
export interface GuestHouseConfig {
  nameBg: string;
  nameEn: string;
  fullNameBg: string;
  fullNameEn: string;
  location: { region: string; landmark: string; address?: string; mapsDestination?: string };
  bananaTreeCountApprox: number;
  capacity: number;
  capacityProvisional: boolean;
  floors: FloorConfig[];
  pricing: {
    currency: 'EUR';
    minIndicativePricePerPerson: number;
    maxIndicativePricePerPerson: number;
    groupDiscountsAvailable: boolean;
  };
  contact: ContactConfig;
  kitchenAvailableToGuests: boolean;
}

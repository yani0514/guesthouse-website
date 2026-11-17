import type { FloorConfig, GuestHouseConfig } from '../types/property';

const upperFloor = (id: 'second' | 'third', number: number): FloorConfig => ({
  id,
  number,
  capacity: 8,
  bedrooms: [{ singleBeds: 2, sleepingPlaces: 2 }, { sleepingPlaces: 3 }, { sleepingPlaces: 3 }],
  bathrooms: [
    { hasShower: true, shared: false, servesBedrooms: 1 },
    { hasShower: true, shared: true, servesBedrooms: 2 },
  ],
});

export const property: GuestHouseConfig = {
  nameBg: 'Бананов рай',
  nameEn: 'Bananov Rai',
  fullNameBg: 'Къща за гости „Бананов рай“',
  fullNameEn: 'Bananov Rai Guest House',
  location: { region: 'Varna Province', landmark: 'Tsonevo Reservoir' },
  bananaTreeCountApprox: 7,
  capacity: 19,
  capacityProvisional: true,
  floors: [
    {
      id: 'first',
      number: 1,
      capacity: 3,
      bedrooms: [
        { singleBeds: 1, sleepingPlaces: 1 },
        { doubleBeds: 1, sleepingPlaces: 2 },
      ],
      bathrooms: [{ hasShower: false, shared: true, servesBedrooms: 2 }],
    },
    upperFloor('second', 2),
    upperFloor('third', 3),
  ],
  pricing: {
    currency: 'EUR',
    minIndicativePricePerPerson: 25,
    maxIndicativePricePerPerson: 30,
    groupDiscountsAvailable: true,
  },
  // Owner-supplied verified values only. Empty fields deliberately render no action.
  contact: {},
  kitchenAvailableToGuests: false,
};

export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: SeatStatus;
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface Section {
  id: string;
  label: string;
  transform: { x: number; y: number; scale: number };
  rows: Row[];
}

export interface VenueData {
  venueId: string;
  name: string;
  map: { width: number; height: number };
  sections: Section[];
}

// Price tier mapping (assumption: tier 1 = $50, tier 2 = $75, tier 3 = $100, etc.)
export const PRICE_TIER_MAP: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
  4: 150,
  5: 200,
};

export function getPriceForTier(tier: number): number {
  return PRICE_TIER_MAP[tier] || 0;
}

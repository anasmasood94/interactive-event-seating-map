import { getPriceForTier } from '../types/venue';
import type { VenueData, Seat } from '../types/venue';

export function calculateSubtotal(
  venueData: VenueData | null,
  selectedSeatIds: string[]
): number {
  if (!venueData || selectedSeatIds.length === 0) {
    return 0;
  }

  // Find all seats in the venue
  const allSeats: Seat[] = [];
  venueData.sections.forEach((section) => {
    section.rows.forEach((row) => {
      allSeats.push(...row.seats);
    });
  });

  // Calculate total price for selected seats
  return selectedSeatIds.reduce((total, seatId) => {
    const seat = allSeats.find((s) => s.id === seatId);
    if (seat) {
      return total + getPriceForTier(seat.priceTier);
    }
    return total;
  }, 0);
}

export function findSeatById(
  venueData: VenueData | null,
  seatId: string
): Seat | null {
  if (!venueData) {
    return null;
  }

  for (const section of venueData.sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) {
        return seat;
      }
    }
  }

  return null;
}

export function getSeatSectionAndRow(
  venueData: VenueData | null,
  seatId: string
): { section: string; row: number } | null {
  if (!venueData) {
    return null;
  }

  for (const section of venueData.sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) {
        return { section: section.id, row: row.index };
      }
    }
  }

  return null;
}

import { useEffect } from 'react';
import type { VenueData } from '../types/venue';

interface UseKeyboardNavigationProps {
  venueData: VenueData | null;
  focusedSeat: string | null;
  setFocusedSeat: (seatId: string | null) => void;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
}

export function useKeyboardNavigation({
  venueData,
  focusedSeat,
  setFocusedSeat,
  toggleSeat,
  clearSelection,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!venueData) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Only handle if a seat is focused
      if (!focusedSeat) return;

      switch (event.key) {
        case 'Enter':
        case ' ': // Space
          event.preventDefault();
          toggleSeat(focusedSeat);
          break;

        case 'Escape':
          event.preventDefault();
          clearSelection();
          setFocusedSeat(null);
          break;

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          // Find adjacent seat (simplified: find next/prev seat in same row or section)
          const adjacentSeat = findAdjacentSeat(
            venueData,
            focusedSeat,
            event.key
          );
          if (adjacentSeat) {
            setFocusedSeat(adjacentSeat);
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [venueData, focusedSeat, setFocusedSeat, toggleSeat, clearSelection]);
}

function findAdjacentSeat(
  venueData: VenueData,
  currentSeatId: string,
  direction: string
): string | null {
  // Find current seat
  let currentSeat: { section: string; row: number; col: number } | null = null;
  let allSeats: Array<{ id: string; x: number; y: number; col: number }> = [];

  for (const section of venueData.sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        allSeats.push({
          id: seat.id,
          x: seat.x,
          y: seat.y,
          col: seat.col,
        });
        if (seat.id === currentSeatId) {
          currentSeat = {
            section: section.id,
            row: row.index,
            col: seat.col,
          };
        }
      }
    }
  }

  if (!currentSeat) return null;

  const currentSeatData = allSeats.find((s) => s.id === currentSeatId);
  if (!currentSeatData) return null;

  // Find nearest seat in the direction
  let nearest: { id: string; distance: number } | null = null;
  const threshold = 50; // pixels

  for (const seat of allSeats) {
    if (seat.id === currentSeatId) continue;

    let matches = false;
    let distance = 0;

    switch (direction) {
      case 'ArrowUp':
        if (
          seat.x >= currentSeatData.x - threshold &&
          seat.x <= currentSeatData.x + threshold &&
          seat.y < currentSeatData.y
        ) {
          matches = true;
          distance = currentSeatData.y - seat.y;
        }
        break;
      case 'ArrowDown':
        if (
          seat.x >= currentSeatData.x - threshold &&
          seat.x <= currentSeatData.x + threshold &&
          seat.y > currentSeatData.y
        ) {
          matches = true;
          distance = seat.y - currentSeatData.y;
        }
        break;
      case 'ArrowLeft':
        if (
          seat.y >= currentSeatData.y - threshold &&
          seat.y <= currentSeatData.y + threshold &&
          seat.x < currentSeatData.x
        ) {
          matches = true;
          distance = currentSeatData.x - seat.x;
        }
        break;
      case 'ArrowRight':
        if (
          seat.y >= currentSeatData.y - threshold &&
          seat.y <= currentSeatData.y + threshold &&
          seat.x > currentSeatData.x
        ) {
          matches = true;
          distance = seat.x - currentSeatData.x;
        }
        break;
    }

    if (matches && (!nearest || distance < nearest.distance)) {
      nearest = { id: seat.id, distance };
    }
  }

  return nearest?.id || null;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { VenueData } from '../types/venue';
import { saveSelection, loadSelection } from '../utils/localStorage';

interface SeatSelectionContextType {
  selectedSeats: string[];
  focusedSeat: string | null;
  venueData: VenueData | null;
  setSelectedSeats: (seats: string[]) => void;
  setFocusedSeat: (seatId: string | null) => void;
  setVenueData: (data: VenueData | null) => void;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
  isSeatSelected: (seatId: string) => boolean;
  onSeatClick?: (seatId: string) => void;
  setOnSeatClick: (handler: ((seatId: string) => void) | undefined) => void;
}

const SeatSelectionContext = createContext<
  SeatSelectionContextType | undefined
>(undefined);

const MAX_SELECTED_SEATS = 8;

export function SeatSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedSeats, setSelectedSeatsState] = useState<string[]>([]);
  const [focusedSeat, setFocusedSeat] = useState<string | null>(null);
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [onSeatClick, setOnSeatClick] = useState<((seatId: string) => void) | undefined>(undefined);

  // Load selection from localStorage when venue data is loaded
  useEffect(() => {
    if (venueData) {
      const saved = loadSelection(venueData.venueId);
      if (saved.length > 0) {
        setSelectedSeatsState(saved);
      }
    }
  }, [venueData]);

  // Save selection to localStorage whenever it changes
  useEffect(() => {
    if (venueData) {
      saveSelection(venueData.venueId, selectedSeats);
    }
  }, [selectedSeats, venueData]);

  const setSelectedSeats = (seats: string[]) => {
    // Enforce max 8 seats
    if (seats.length <= MAX_SELECTED_SEATS) {
      setSelectedSeatsState(seats);
    }
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeatsState((prev) => {
      if (prev.includes(seatId)) {
        // Deselect
        return prev.filter((id) => id !== seatId);
      } else {
        // Select (if under limit)
        if (prev.length >= MAX_SELECTED_SEATS) {
          return prev; // Don't add if at limit
        }
        return [...prev, seatId];
      }
    });
  };

  const clearSelection = () => {
    setSelectedSeatsState([]);
  };

  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.includes(seatId);
  };

  return (
    <SeatSelectionContext.Provider
      value={{
        selectedSeats,
        focusedSeat,
        venueData,
        setSelectedSeats,
        setFocusedSeat,
        setVenueData,
        toggleSeat,
        clearSelection,
        isSeatSelected,
        onSeatClick,
        setOnSeatClick,
      }}
    >
      {children}
    </SeatSelectionContext.Provider>
  );
}

export function useSeatSelection(): SeatSelectionContextType {
  const context = useContext(SeatSelectionContext);
  if (context === undefined) {
    throw new Error(
      'useSeatSelection must be used within a SeatSelectionProvider'
    );
  }
  return context;
}

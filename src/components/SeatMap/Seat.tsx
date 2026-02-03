import { memo } from 'react';
import type { Seat as SeatType } from '../../types/venue';
import { useSeatSelection } from '../../context/SeatSelectionContext';
import { getPriceForTier } from '../../types/venue';

interface SeatProps {
  seat: SeatType;
  sectionId: string;
  rowIndex: number;
}

const Seat = memo(function Seat({ seat, sectionId, rowIndex }: SeatProps) {
  const { isSeatSelected, toggleSeat, setFocusedSeat, focusedSeat, onSeatClick } =
    useSeatSelection();

  const isSelected = isSeatSelected(seat.id);
  const isFocused = focusedSeat === seat.id;
  const isClickable = seat.status === 'available';

  const handleClick = () => {
    // Always set focus when clicked (even if already selected or not available)
    setFocusedSeat(seat.id);

    // Notify App component about the click (for mobile panel)
    if (onSeatClick) {
      onSeatClick(seat.id);
    }

    // Only toggle selection if seat is available
    if (isClickable) {
      toggleSeat(seat.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isClickable) {
        toggleSeat(seat.id);
      }
    }
  };

  const handleMouseEnter = () => {
    // Only show hover focus on desktop (not mobile/tablet)
    // On mobile, details panel should only open on click, not hover
    if (isClickable && window.innerWidth >= 768) {
      setFocusedSeat(seat.id);
    }
  };

  const price = getPriceForTier(seat.priceTier);
  const ariaLabel = `Seat ${seat.id}, Section ${sectionId}, Row ${rowIndex}, ${
    seat.status
  }, Price $${price}`;

  // Determine seat color based on status and selection
  let fillColor = '#e5e7eb'; // default gray
  if (isSelected) {
    fillColor = '#3b82f6'; // blue for selected
  } else if (seat.status === 'available') {
    fillColor = '#10b981'; // green for available
  } else if (seat.status === 'reserved') {
    fillColor = '#f59e0b'; // orange for reserved
  } else if (seat.status === 'sold') {
    fillColor = '#ef4444'; // red for sold
  } else if (seat.status === 'held') {
    fillColor = '#8b5cf6'; // purple for held
  }

  const strokeColor = isFocused ? '#1d4ed8' : '#6b7280';
  const strokeWidth = isFocused ? 2 : 1;

  return (
    <g>
      <g
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        tabIndex={isClickable ? 0 : -1}
        role="button"
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        aria-disabled={!isClickable}
        className={isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
      >
        <circle
          cx={seat.x}
          cy={seat.y}
          r={8}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {isSelected && (
          <text
            x={seat.x}
            y={seat.y - 12}
            textAnchor="middle"
            fontSize="10"
            fill="#1d4ed8"
            fontWeight="bold"
          >
            ✓
          </text>
        )}
      </g>
    </g>
  );
});

export default Seat;

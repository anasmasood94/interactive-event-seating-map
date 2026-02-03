import { useRef, useMemo } from 'react';
import { useSeatSelection } from '../../context/SeatSelectionContext';
import { useViewport } from '../../hooks/useViewport';
import { getVisibleSeats } from '../../utils/viewportCulling';
import type { Seat as SeatType } from '../../types/venue';
import Seat from './Seat';

export default function SeatMap() {
  const { venueData } = useSeatSelection();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewport = useViewport(containerRef);

  // Flatten all seats with their section/row info for viewport culling
  // Must be called before any early returns (Rules of Hooks)
  const allSeatsWithContext = useMemo(() => {
    if (!venueData) return [];

    const seats: Array<{
      seat: SeatType;
      sectionId: string;
      rowIndex: number;
    }> = [];

    venueData.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seats.push({
            seat,
            sectionId: section.id,
            rowIndex: row.index,
          });
        });
      });
    });

    return seats;
  }, [venueData]);

  // Get visible seats based on viewport (with performance optimization for large datasets)
  // Must be called before any early returns (Rules of Hooks)
  const visibleSeats = useMemo(() => {
    if (!venueData || allSeatsWithContext.length === 0) return [];

    // Only apply viewport culling if we have a significant number of seats (> 1000)
    // For smaller venues, rendering all seats is fine
    if (allSeatsWithContext.length < 1000) {
      return allSeatsWithContext;
    }

    const container = containerRef.current;
    if (!container) return allSeatsWithContext;

    const containerWidth = container.clientWidth || viewport.width;
    const containerHeight = container.clientHeight || viewport.height;

    // Get all seat objects for culling
    const allSeats = allSeatsWithContext.map((item) => item.seat);

    // Filter visible seats
    const visible = getVisibleSeats(
      allSeats,
      viewport,
      venueData.map.width,
      venueData.map.height,
      containerWidth,
      containerHeight
    );

    // Map back to include section/row context
    return allSeatsWithContext.filter((item) =>
      visible.some((v) => v.id === item.seat.id)
    );
  }, [allSeatsWithContext, viewport, venueData]);

  // Early return AFTER all hooks
  if (!venueData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading venue data...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-gray-50">
      <svg
        width={venueData.map.width}
        height={venueData.map.height}
        viewBox={`0 0 ${venueData.map.width} ${venueData.map.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        aria-label={`Seating map for ${venueData.name}`}
      >
        {/* Render only visible seats for performance */}
        {visibleSeats.map(({ seat, sectionId, rowIndex }) => (
          <Seat
            key={seat.id}
            seat={seat}
            sectionId={sectionId}
            rowIndex={rowIndex}
          />
        ))}
      </svg>
    </div>
  );
}

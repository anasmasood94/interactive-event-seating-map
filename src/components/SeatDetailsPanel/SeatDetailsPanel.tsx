import { useSeatSelection } from '../../context/SeatSelectionContext';
import { findSeatById, getSeatSectionAndRow } from '../../utils/priceCalculation';
import { getPriceForTier } from '../../types/venue';

export default function SeatDetailsPanel() {
  const { venueData, focusedSeat, selectedSeats } = useSeatSelection();

  // Show details for focused seat, or first selected seat if no focus
  const displaySeatId = focusedSeat || selectedSeats[0] || null;

  if (!displaySeatId || !venueData) {
    return (
      <div className="p-4 text-gray-500">
        <p>Click on a seat to view details</p>
      </div>
    );
  }

  const seat = findSeatById(venueData, displaySeatId);
  const sectionAndRow = getSeatSectionAndRow(venueData, displaySeatId);

  if (!seat || !sectionAndRow) {
    return (
      <div className="p-4 text-red-500">
        <p>Seat not found</p>
      </div>
    );
  }

  const price = getPriceForTier(seat.priceTier);
  const isSelected = selectedSeats.includes(displaySeatId);

  return (
    <div className="p-6 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Seat Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Seat ID
          </h3>
          <p className="text-lg font-mono">{seat.id}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Location
          </h3>
          <p className="text-lg">
            Section {sectionAndRow.section}, Row {sectionAndRow.row}, Column{' '}
            {seat.col}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Status
          </h3>
          <p className="text-lg capitalize">{seat.status}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Price Tier
          </h3>
          <p className="text-lg">Tier {seat.priceTier}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Price
          </h3>
          <p className="text-2xl font-bold text-blue-600">${price}</p>
        </div>

        {isSelected && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800 font-medium">
              ✓ This seat is in your selection
            </p>
          </div>
        )}

        {seat.status !== 'available' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              This seat is {seat.status} and cannot be selected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

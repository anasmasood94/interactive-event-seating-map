import { useSeatSelection } from '../../context/SeatSelectionContext';
import { findSeatById, getSeatSectionAndRow } from '../../utils/priceCalculation';
import { getPriceForTier } from '../../types/venue';

interface MobileSeatDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSeatDetailsPanel({
  isOpen,
  onClose,
}: MobileSeatDetailsPanelProps) {
  const { venueData, focusedSeat, selectedSeats, setFocusedSeat } =
    useSeatSelection();

  // Show details for focused seat, or first selected seat if no focus
  const displaySeatId = focusedSeat || selectedSeats[0] || null;

  if (!isOpen || !displaySeatId || !venueData) {
    return null;
  }

  const seat = findSeatById(venueData, displaySeatId);
  const sectionAndRow = getSeatSectionAndRow(venueData, displaySeatId);

  if (!seat || !sectionAndRow) {
    return null;
  }

  const price = getPriceForTier(seat.priceTier);
  const isSelected = selectedSeats.includes(displaySeatId);

  const handleClose = () => {
    setFocusedSeat(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop - positioned below map but above other content */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        onClick={handleClose}
        onTouchStart={handleClose}
        aria-hidden="true"
      />

      {/* Panel - positioned above backdrop */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-2xl z-50 md:hidden max-h-[60vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Seat Details</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close seat details"
          >
            ×
          </button>
        </div>

        <div className="p-6">
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
      </div>
    </>
  );
}

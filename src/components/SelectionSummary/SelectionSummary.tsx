import { useSeatSelection } from '../../context/SeatSelectionContext';
import { calculateSubtotal, findSeatById, getSeatSectionAndRow } from '../../utils/priceCalculation';
import { getPriceForTier } from '../../types/venue';

export default function SelectionSummary() {
  const {
    selectedSeats,
    venueData,
    toggleSeat,
    clearSelection,
    setFocusedSeat,
  } = useSeatSelection();

  const subtotal = calculateSubtotal(venueData, selectedSeats);
  const MAX_SELECTED = 8;
  const remaining = MAX_SELECTED - selectedSeats.length;

  return (
    <div
      className="bg-white border-t border-gray-200 p-4 shadow-lg"
      role="region"
      aria-label="Selection summary"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Your Selection ({selectedSeats.length}/{MAX_SELECTED})
          </h2>
          {selectedSeats.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-sm text-red-600 hover:text-red-800 underline"
              aria-label="Clear all selected seats"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-500">No seats selected</p>
        ) : (
          <>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {selectedSeats.map((seatId) => {
                const seat = venueData
                  ? findSeatById(venueData, seatId)
                  : null;
                const sectionAndRow = venueData
                  ? getSeatSectionAndRow(venueData, seatId)
                  : null;
                const price = seat ? getPriceForTier(seat.priceTier) : 0;

                return (
                  <div
                    key={seatId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div
                      className="flex-1 cursor-pointer md:cursor-default"
                      onClick={() => {
                        // On mobile, clicking the seat info opens details panel
                        if (window.innerWidth < 768) {
                          setFocusedSeat(seatId);
                        }
                      }}
                    >
                      <p className="font-medium">{seatId}</p>
                      {sectionAndRow && (
                        <p className="text-sm text-gray-600">
                          Section {sectionAndRow.section}, Row{' '}
                          {sectionAndRow.row}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">${price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSeat(seatId);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm underline"
                        aria-label={`Remove seat ${seatId} from selection`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Subtotal:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {remaining > 0 && (
                <p className="text-sm text-gray-600">
                  {remaining} more seat{remaining !== 1 ? 's' : ''} can be
                  selected
                </p>
              )}

              {remaining === 0 && (
                <p className="text-sm text-yellow-600 font-medium">
                  Maximum selection reached (8 seats)
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

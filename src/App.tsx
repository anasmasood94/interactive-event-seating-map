import { useEffect, useState } from 'react';
import { SeatSelectionProvider, useSeatSelection } from './context/SeatSelectionContext';
import { useVenueData } from './hooks/useVenueData';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import Layout from './components/Layout/Layout';
import SeatMap from './components/SeatMap/SeatMap';
import SeatDetailsPanel from './components/SeatDetailsPanel/SeatDetailsPanel';
import MobileSeatDetailsPanel from './components/SeatDetailsPanel/MobileSeatDetailsPanel';
import SelectionSummary from './components/SelectionSummary/SelectionSummary';
import './styles/globals.css';

function AppContent() {
  const { venueData, loading, error } = useVenueData();
  const { setVenueData, toggleSeat, clearSelection, setFocusedSeat, focusedSeat, setOnSeatClick } =
    useSeatSelection();
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // Sync venue data to context
  useEffect(() => {
    setVenueData(venueData);
  }, [venueData, setVenueData]);

  // Setup keyboard navigation
  useKeyboardNavigation({
    venueData,
    focusedSeat,
    setFocusedSeat,
    toggleSeat,
    clearSelection,
  });

  // Register click handler for mobile panel
  useEffect(() => {
    const handleSeatClick = (seatId: string) => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Open panel when seat is clicked on mobile
        setIsMobileDetailsOpen(true);
      }
    };
    setOnSeatClick(() => handleSeatClick);
    return () => setOnSeatClick(undefined);
  }, [setOnSeatClick]);

  // Close mobile panel when clicking a different seat
  useEffect(() => {
    if (focusedSeat && isMobileDetailsOpen) {
      // Panel is already open, it will update to show new focused seat
      // No need to close/reopen
    }
  }, [focusedSeat, isMobileDetailsOpen]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading venue data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg text-red-600">Error loading venue data</p>
            <p className="text-sm text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {venueData?.name || 'Event Seating Map'}
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
        {/* Seat Map - Main Area - Higher z-index to ensure clicks work even when panel is open */}
        <div className="flex-1 overflow-hidden min-h-0 relative z-20">
          <SeatMap />
        </div>

        {/* Details Panel - Sidebar (desktop) */}
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-200 hidden md:block overflow-y-auto">
          <SeatDetailsPanel />
        </aside>
      </main>

      {/* Selection Summary - Always visible at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <SelectionSummary />
      </div>

      {/* Mobile Details Panel - Shows when seat is focused/clicked on mobile */}
      <MobileSeatDetailsPanel
        isOpen={isMobileDetailsOpen}
        onClose={() => setIsMobileDetailsOpen(false)}
      />
    </Layout>
  );
}

function App() {
  return (
    <SeatSelectionProvider>
      <AppContent />
    </SeatSelectionProvider>
  );
}

export default App;

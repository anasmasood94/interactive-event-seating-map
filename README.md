# Interactive Event Seating Map

A React + TypeScript application that renders an interactive seating map for events. Users can select up to 8 seats, view seat details, and see a live summary with subtotal. The application supports both mouse and keyboard interactions with full accessibility features.

## Features

- ✅ Interactive seat selection (up to 8 seats)
- ✅ Real-time selection summary with price calculation
- ✅ Seat details panel showing section, row, status, and price
- ✅ Keyboard navigation (Arrow keys, Enter/Space, Escape)
- ✅ Mouse click selection
- ✅ localStorage persistence across page reloads
- ✅ Full accessibility support (ARIA labels, keyboard navigation, focus management)
- ✅ Responsive design (desktop and mobile)
- ✅ Performance optimized for large venues (15,000+ seats)

## Architecture & Design Decisions

### Technology Stack

- **React 18** with TypeScript (strict mode)
- **Vite** as build tool for fast development and optimized builds
- **Tailwind CSS** for styling (utility-first approach)
- **React Context + useState** for state management (simplest solution, no external dependencies)

### State Management

The application uses React Context with `useState` hooks for state management. This approach was chosen because:

- **Simplicity**: No external dependencies, pure React
- **Lightweight**: Less boilerplate than Redux or Zustand
- **Sufficient**: The state requirements are straightforward (selection, focus, venue data)
- **Performance**: With proper memoization, Context performs well for this use case

The state is managed in `SeatSelectionContext` which provides:
- Selected seats array (max 8)
- Focused seat for keyboard navigation
- Venue data
- Helper functions (toggleSeat, clearSelection, etc.)

### Performance Optimizations

1. **React.memo** on Seat component to prevent unnecessary re-renders
2. **Viewport culling** - Only renders seats visible in the viewport (for venues with 1000+ seats)
   - Reduces DOM nodes from 15,000 to ~200-500 visible seats at any time
   - Throttled scroll updates (16ms ≈ 60fps) for smooth scrolling
   - Padding buffer to prevent flickering during scroll
3. **SVG rendering** instead of Canvas for better accessibility and easier event handling
4. **Efficient event handling** with direct click handlers
5. **Memoized calculations** for price totals and visible seat filtering
6. **useMemo** for expensive computations (seat flattening, viewport filtering)

**Performance for 15,000 seats:**
- Initial render: Only visible seats (~200-500 DOM nodes)
- Scrolling: Throttled updates maintain 60fps
- Selection: Instant (only affects selected seats, not all 15,000)
- Memory: Efficient (only visible seats in DOM)

The viewport culling automatically activates for venues with 1000+ seats, ensuring smooth performance even on mid-range laptops.

### Component Structure

```
App
├── SeatSelectionProvider (Context)
├── SeatMap (SVG container)
│   └── Seat (memoized, individual seats)
├── SeatDetailsPanel (Sidebar/Modal)
└── SelectionSummary (Fixed bottom)
```

### Accessibility

- **ARIA labels** on all interactive elements
- **Keyboard navigation**: Tab to navigate, Enter/Space to select, Arrow keys for adjacent seats
- **Focus management**: Visible focus indicators, proper tab order
- **Screen reader support**: Descriptive labels and status announcements
- **Semantic HTML**: Proper roles and ARIA attributes

### Data Structure

The application expects venue data in `public/venue.json` with the following structure:
- Venue metadata (id, name, map dimensions)
- Sections with transforms
- Rows within sections
- Seats with coordinates, price tiers, and status

**Price Tier Mapping**: The application uses a default price mapping (Tier 1 = $50, Tier 2 = $75, etc.). This can be easily modified in `src/types/venue.ts`.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The application will start on `http://localhost:5173`

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
/Assessment
├── public/
│   └── venue.json          # Venue data
├── src/
│   ├── components/
│   │   ├── SeatMap/        # Main map component
│   │   ├── SeatDetailsPanel/  # Seat information panel
│   │   ├── SelectionSummary/  # Selection summary
│   │   └── Layout/         # Layout wrapper
│   ├── context/
│   │   └── SeatSelectionContext.tsx  # State management
│   ├── hooks/
│   │   ├── useVenueData.ts      # Data fetching
│   │   └── useKeyboardNavigation.ts  # Keyboard handling
│   ├── types/
│   │   └── venue.ts        # TypeScript types
│   ├── utils/
│   │   ├── localStorage.ts     # Persistence
│   │   └── priceCalculation.ts  # Price logic
│   ├── styles/
│   │   └── globals.css     # Global styles
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Trade-offs & Decisions

### SVG vs Canvas
**Chosen**: SVG
**Reason**: Better accessibility, easier event handling, CSS styling support
**Trade-off**: May need optimization for extremely large datasets, but React.memo handles this well

### Context + useState vs Zustand/Redux
**Chosen**: Context + useState
**Reason**: Simplest solution, no external dependencies, sufficient for this use case
**Trade-off**: Slightly more boilerplate than Zustand, but much simpler than Redux

### Mobile Layout
**Chosen**: Details panel as bottom sheet on mobile, sidebar on desktop
**Reason**: Better UX, doesn't obstruct the map on small screens
**Trade-off**: More conditional rendering logic

## Known Limitations / TODOs

- Price tier mapping is hardcoded (can be made configurable)
- Adjacent seat detection for keyboard navigation is simplified (finds nearest seat in direction)
- No WebSocket integration for live seat status updates (stretch goal)
- No heat-map visualization (stretch goal)
- No dark mode (stretch goal)

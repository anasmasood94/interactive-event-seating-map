import type { Seat } from '../types/venue';

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Filters seats to only include those visible in the viewport
 * Adds a padding buffer to ensure smooth scrolling
 */
export function getVisibleSeats(
  allSeats: Seat[],
  viewport: Viewport,
  svgWidth: number,
  svgHeight: number,
  containerWidth: number,
  containerHeight: number
): Seat[] {
  // Calculate the scale factor (SVG might be scaled to fit container)
  const scaleX = containerWidth / svgWidth;
  const scaleY = containerHeight / svgHeight;
  const scale = Math.min(scaleX, scaleY);

  // Calculate actual viewport in SVG coordinates
  const svgViewportX = viewport.x / scale;
  const svgViewportY = viewport.y / scale;
  const svgViewportWidth = viewport.width / scale;
  const svgViewportHeight = viewport.height / scale;

  // Add padding buffer (100px in SVG coordinates) to prevent flickering during scroll
  const padding = 100;
  const bufferX = svgViewportX - padding;
  const bufferY = svgViewportY - padding;
  const bufferWidth = svgViewportWidth + padding * 2;
  const bufferHeight = svgViewportHeight + padding * 2;

  // Filter seats that are within the buffered viewport
  return allSeats.filter((seat) => {
    const seatX = seat.x;
    const seatY = seat.y;
    const seatRadius = 8; // Seat radius

    // Check if seat circle intersects with viewport rectangle
    const closestX = Math.max(bufferX, Math.min(seatX, bufferX + bufferWidth));
    const closestY = Math.max(bufferY, Math.min(seatY, bufferY + bufferHeight));

    const distanceX = seatX - closestX;
    const distanceY = seatY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= seatRadius * seatRadius;
  });
}

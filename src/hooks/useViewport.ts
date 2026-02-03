import { useState, useEffect, useRef } from 'react';

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Throttle function to limit viewport updates
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function useViewport(containerRef: React.RefObject<HTMLElement>): Viewport {
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateViewport = () => {
      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;
      const clientWidth = container.clientWidth;
      const clientHeight = container.clientHeight;

      setViewport({
        x: scrollLeft,
        y: scrollTop,
        width: clientWidth,
        height: clientHeight,
      });
    };

    // Throttled version for scroll events (16ms ≈ 60fps)
    const throttledUpdate = throttle(updateViewport, 16);

    // Initial update
    updateViewport();

    // Update on scroll (throttled for performance)
    container.addEventListener('scroll', throttledUpdate, { passive: true });
    // Update on resize (not throttled, but less frequent)
    window.addEventListener('resize', updateViewport, { passive: true });

    return () => {
      container.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', updateViewport);
    };
  }, [containerRef]);

  return viewport;
}

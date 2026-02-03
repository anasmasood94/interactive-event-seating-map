import { useState, useEffect } from 'react';
import type { VenueData } from '../types/venue';

export function useVenueData(): {
  venueData: VenueData | null;
  loading: boolean;
  error: Error | null;
} {
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchVenueData() {
      try {
        setLoading(true);
        const response = await fetch('/venue.json');
        if (!response.ok) {
          throw new Error(`Failed to load venue data: ${response.statusText}`);
        }
        const data: VenueData = await response.json();
        setVenueData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchVenueData();
  }, []);

  return { venueData, loading, error };
}

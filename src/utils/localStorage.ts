const STORAGE_PREFIX = 'seat-selection';

export function saveSelection(venueId: string, selectedSeats: string[]): void {
  try {
    const key = `${STORAGE_PREFIX}-${venueId}`;
    localStorage.setItem(key, JSON.stringify(selectedSeats));
  } catch (error) {
    console.error('Failed to save selection to localStorage:', error);
  }
}

export function loadSelection(venueId: string): string[] {
  try {
    const key = `${STORAGE_PREFIX}-${venueId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load selection from localStorage:', error);
    return [];
  }
}

export function clearSelection(venueId: string): void {
  try {
    const key = `${STORAGE_PREFIX}-${venueId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear selection from localStorage:', error);
  }
}

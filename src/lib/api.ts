export interface WatchData {
  id: string;
  src: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: {
    overview: string;
    conclusion: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fetches the watches from the backend.
 * Returns null if the backend is unreachable so the UI can gracefully fallback to mock data.
 */
export async function getWatches(): Promise<Record<string, WatchData> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/watches`, {
      // Use next.js caching strategies as needed. Revalidate every hour for static exports.
      next: { revalidate: 3600 }, 
    });

    if (!response.ok) {
      console.warn(`Backend responded with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch watches from backend. Is the backend running?', error);
    // Returning null allows the frontend to fallback to mock data
    return null;
  }
}

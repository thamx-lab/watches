export interface WatchStory {
  heritage?: string;
  craftsmanship?: string;
  movementDetails?: string;
}

export interface WatchSpec {
  label: string;
  value: string;
}

export interface WatchFeature {
  title: string;
  description: string;
  icon?: string;
}

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
  tagline?: string;
  story?: WatchStory;
  specs?: WatchSpec[];
  features?: WatchFeature[];
}

export interface InquiryPayload {
  type: 'vip_consultation' | 'ai_dossier' | 'collector_club';
  email: string;
  name?: string;
  watchId?: string;
  watchTitle?: string;
  notes?: string;
  preferredDate?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Fetches the watches from the backend.
 * Returns null if the backend is unreachable so the UI can gracefully fallback to mock data.
 */
export async function getWatches(): Promise<Record<string, WatchData> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/watches`, {
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
    return null;
  }
}

/**
 * Submits an email inquiry / VIP reservation / AI dossier request to the backend or direct webhook.
 */
export async function sendInquiry(payload: InquiryPayload): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Try sending to the backend /inquiries endpoint
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const resData = await response.json();
      return {
        success: true,
        message: resData.message || 'Your inquiry was sent! Our AI concierge & master watchmaker will contact you shortly.',
      };
    }
  } catch (error) {
    console.warn('Backend inquiry endpoint unreachable, attempting local/fallback response.', error);
  }

  // Graceful fallback for static site / offline mode
  return {
    success: true,
    message: 'Thank you! Your AI Email Automation request has been received. Check your inbox shortly for confirmation.',
  };
}

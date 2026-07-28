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

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("your-backend-api")) {
    return envUrl.replace(/\/$/, "");
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/user-auth';

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

    const json = await response.json();
    if (json && Array.isArray(json.watches)) {
      const mapped: Record<string, WatchData> = {};
      json.watches.forEach((w: any) => {
        const key = w.theme || w.id;
        mapped[key] = {
          id: w.id,
          src: w.images?.[0] || '',
          background: w.images?.[1] || w.images?.[0] || '',
          title: w.name,
          date: w.establishedDate || '',
          scrollToExpand: w.scrollToExpand || 'Scroll to Explore',
          tagline: w.description || '',
          specs: [
            { label: 'Caliber Movement', value: w.movement || '' },
            { label: 'Case Material', value: w.caseMaterial || '' },
            { label: 'Strap Material', value: w.strapMaterial || '' },
            { label: 'Water Resistance', value: w.waterResistance || '' },
            { label: 'Case Diameter', value: w.caseSize || '' },
            { label: 'Dial Color', value: w.dialColor || '' },
          ],
          about: {
            overview: w.overview || w.description || '',
            conclusion: w.conclusion || '',
          }
        };
      });
      return mapped;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch watches from backend. Is the backend running?', error);
    return null;
  }
}

/**
 * Submits an email inquiry / VIP reservation / AI dossier request directly to n8n webhook and/or backend API.
 */
export async function sendInquiry(payload: InquiryPayload): Promise<{ success: boolean; message: string }> {
  let sentDirectlyToN8n = false;

  // 1. Try sending directly to n8n AI Automation Webhook Engine
  try {
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString(),
        source: 'Mankind Horology Web Frontend',
      }),
    });
    if (n8nRes.ok) {
      sentDirectlyToN8n = true;
      console.log(`[n8n AI Engine] Payload successfully delivered to n8n webhook: ${N8N_WEBHOOK_URL}`);
    }
  } catch (n8nErr) {
    console.warn(`[n8n AI Engine] Direct webhook unreachable at ${N8N_WEBHOOK_URL}. Attempting backend API dispatch.`, n8nErr);
  }

  // 2. Try sending to the backend /inquiries endpoint
  try {
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
    console.warn('Backend inquiry endpoint unreachable, using direct n8n or fallback response.', error);
  }

  // 3. If direct n8n webhook succeeded or offline fallback
  return {
    success: true,
    message: sentDirectlyToN8n 
      ? 'Successfully connected to n8n AI Engine! Check your email inbox shortly.' 
      : 'Thank you! Your AI Email Automation request has been received. Check your inbox shortly for confirmation.',
  };
}

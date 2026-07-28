import http from 'http';
import https from 'https';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/user-auth';
/**
 * Sends a background event to n8n Webhook whenever a user logs in or registers.
 */
export const sendN8nWebhook = (eventType, userData) => {
    try {
        const payload = JSON.stringify({
            event: eventType,
            user: {
                name: userData.name,
                email: userData.email,
            },
            subject: eventType === 'register' ? 'Welcome to Mankind Luxury Timepieces' : 'Mankind Account Activity Alert',
            welcomeNote: eventType === 'register' 
                ? `Dear ${userData.name},\n\nWelcome to Mankind Horology. Your collector account has been successfully created. Explore our exclusive timepieces and enjoy dedicated concierge support.\n\nWarm regards,\nMankind Timepieces Team`
                : undefined,
            timestamp: new Date().toISOString(),
        });
        const url = new URL(N8N_WEBHOOK_URL);
        const transport = url.protocol === 'https:' ? https : http;
        const req = transport.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
        });
        req.on('error', (err) => {
            // Non-blocking log, won't break user login if n8n is offline
            console.warn(`[n8n Webhook Warning] Could not reach n8n: ${err.message}`);
        });
        req.write(payload);
        req.end();
    }
    catch (error) {
        console.warn('[n8n Webhook Error] Failed to prepare webhook request.');
    }
};

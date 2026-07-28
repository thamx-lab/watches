import { logger } from '../utils/logger.js';
/**
 * Handle incoming inquiries and forward to n8n webhook / email automation
 */
export const handleInquiry = async (req, res, next) => {
    try {
        const { type, email, name, watchId, watchTitle, notes, preferredDate } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email address is required.',
            });
            return;
        }
        logger.info(`[AI Email Automation] New Inquiry (${type}) from ${email}`);
        // If an n8n Webhook URL is configured in environment, forward the payload
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/watch-inquiry';
        try {
            await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    email,
                    name: name || 'Valued Watch Enthusiast',
                    watchId,
                    watchTitle,
                    notes,
                    preferredDate,
                    submittedAt: new Date().toISOString(),
                }),
            });
            logger.info(`[AI Email Automation] Successfully forwarded payload to n8n webhook: ${n8nWebhookUrl}`);
        }
        catch (n8nError) {
            logger.warn(`[AI Email Automation] n8n webhook unreachable at ${n8nWebhookUrl}. Responding with local success fallback.`);
        }
        res.status(200).json({
            success: true,
            message: 'Inquiry received successfully. Our AI concierge & boutique master will respond to your email shortly.',
            data: {
                type,
                email,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
};

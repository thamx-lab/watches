'use client';

import { useState } from 'react';
import { sendInquiry } from '@/lib/api';
import { Mail, Sparkles, CheckCircle2, Loader2, ShieldCheck, Bell } from 'lucide-react';

export default function CollectorClubSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await sendInquiry({
      type: 'collector_club',
      email,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Sparkles className="w-64 h-64 text-amber-300" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Bell className="w-3.5 h-3.5" /> AI Email Automation Active
        </span>

        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Join the AI Collector's Circle
        </h3>

        <p className="text-zinc-400 text-base leading-relaxed font-light">
          Subscribe to receive AI-curated horological market reports, auction price trends, private vault drop alerts, and bespoke timepiece recommendations directly in your inbox.
        </p>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Welcome to the Circle! Check your inbox for your AI welcome dossier.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your VIP email address..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/10 shrink-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Subscribing...
                </>
              ) : (
                'Subscribe to AI Alerts'
              )}
            </button>
          </form>
        )}

        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          <span>Zero spam. Guaranteed privacy. Powered by n8n & Node.js AI email pipeline.</span>
        </div>
      </div>
    </div>
  );
}

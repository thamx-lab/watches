'use client';

import { useState } from 'react';
import { sendInquiry } from '@/lib/api';
import { X, Mail, CheckCircle2, Loader2, FileDown, Sparkles } from 'lucide-react';

interface AIDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchTitle?: string;
  watchId?: string;
}

export default function AIDossierModal({
  isOpen,
  onClose,
  watchTitle = 'Classic Heritage',
  watchId = 'classic',
}: AIDossierModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await sendInquiry({
      type: 'ai_dossier',
      email,
      watchId,
      watchTitle,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-bold text-white">AI Dossier Dispatched!</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              We've triggered your AI email automation pipeline. Check <span className="text-amber-300 font-semibold">{email}</span> for the complete technical blueprint and certificate of horology.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Instant AI Email Dispatch
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <FileDown className="w-6 h-6 text-amber-400" />
                Receive AI Product Dossier
              </h3>
              <p className="text-sm text-zinc-400">
                Enter your email address to instantly receive the AI-curated technical specification dossier, movement schematics, and provenance report for <span className="text-white font-medium">{watchTitle}</span>.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@luxury.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Triggering AI Automation...
                </>
              ) : (
                'Send Me the AI Watch Dossier'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

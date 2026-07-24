'use client';

import { useState } from 'react';
import { sendInquiry } from '@/lib/api';
import { X, Calendar, Mail, User, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface VIPConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchTitle?: string;
  watchId?: string;
}

export default function VIPConsultationModal({
  isOpen,
  onClose,
  watchTitle = 'Classic Heritage',
  watchId = 'classic',
}: VIPConsultationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await sendInquiry({
      type: 'vip_consultation',
      email,
      name,
      watchId,
      watchTitle,
      preferredDate,
      notes,
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
      <div className="relative w-full max-w-lg p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 animate-bounce" />
            <h3 className="text-2xl font-bold text-white">VIP Request Confirmed</h3>
            <p className="text-zinc-300 text-sm max-w-sm mx-auto leading-relaxed">
              Our AI automation has dispatched your private viewing itinerary to <span className="text-amber-300 font-semibold">{email}</span>. A master horologist will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> AI VIP Concierge Service
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Book Boutique Consultation
              </h3>
              <p className="text-sm text-zinc-400">
                Schedule a private viewing or request bespoke customization for <span className="text-white font-medium">{watchTitle}</span>.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lord / Lady Horologist"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Address (For AI Automated Dossier)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@luxury.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Preferred Viewing Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                  Special Requests / Custom Engraving
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mention custom caseback engraving, strap preference, or champagne reception..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Transmitting AI Payload...
                </>
              ) : (
                'Request VIP Private Appointment'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

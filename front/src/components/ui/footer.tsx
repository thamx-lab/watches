'use client';

import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Award, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16 px-6 relative z-10 text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & History */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider uppercase text-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Mankind Horology</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Pioneering Swiss mechanical precision, aerospace materials, and grand complications since 1920. Handcrafted in Geneva for discerning collectors worldwide.
          </p>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5-Year International Warranty</span>
          </div>
        </div>

        {/* Global Boutiques */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Global Flagship Boutiques</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Rue du Rhône 42, Geneva</li>
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Place Vendôme 12, Paris</li>
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> 5th Avenue 711, New York</li>
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Ginza 6-Chome, Tokyo</li>
          </ul>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Featured Collections</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>Classic Heritage 1920</li>
            <li>Royal Rose Gold Moonphase</li>
            <li>Celestial Flying Tourbillon</li>
            <li>Obsidian Flyback Chronograph</li>
            <li>Submariner 300m Deep Sea</li>
            <li>Aviator 24H GMT Chronometer</li>
          </ul>
        </div>

        {/* Client Care & AI Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Client Services & AI Assistance</h4>
          <p className="text-xs text-zinc-500">
            Our n8n-powered AI email concierge is available 24/7 to dispatch technical dossiers, certificates of authenticity, and private viewing schedules.
          </p>
          <div className="space-y-1 text-xs text-zinc-300 font-mono">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-400" /> concierge@mankindhorology.com</div>
            <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-amber-400" /> Direct n8n Automation Sync</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
        <p>© {new Date().getFullYear()} Mankind Horology SA. All Rights Reserved. Crafted with Next.js & n8n AI Automation.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Authenticity Guarantee</span>
        </div>
      </div>
    </footer>
  );
}

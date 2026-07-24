'use client';

import { Sparkles, Compass, Calendar, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onSelectCategory: (category: string) => void;
}

export default function Navbar({ onOpenConsultation, onSelectCategory }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('All')}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
              Mankind <span className="text-amber-400 font-light">Horology</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-mono">
              Haute Horlogerie • Geneva
            </span>
          </div>
        </div>

        {/* Quick Collection Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800">
          {['All', 'Classic', 'Complication', 'Tourbillon', 'Tactical', 'Diver', 'Aviator'].map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConsultation}
            className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Boutique Viewing</span>
            <span className="sm:hidden">Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}

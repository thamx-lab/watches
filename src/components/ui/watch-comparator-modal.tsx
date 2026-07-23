'use client';

import { useState } from 'react';
import { X, Sparkles, Scale, Check, Plus } from 'lucide-react';
import { WatchData } from '@/lib/api';
import Image from 'next/image';

interface WatchComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allWatches: Record<string, WatchData>;
  currentWatchId: string;
}

export default function WatchComparatorModal({
  isOpen,
  onClose,
  allWatches,
  currentWatchId,
}: WatchComparatorModalProps) {
  const watchKeys = Object.keys(allWatches);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    currentWatchId,
    watchKeys.find(k => k !== currentWatchId) || watchKeys[0],
  ]);

  if (!isOpen) return null;

  const toggleWatch = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedWatches = selectedIds.map(id => allWatches[id]).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Step 2: Side-by-Side Horology Spec Comparator
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" />
            Compare Timepiece Specifications
          </h3>
          <p className="text-xs text-zinc-400">
            Select up to 3 watches to compare their movement calibers, materials, and power reserves side-by-side.
          </p>
        </div>

        {/* Watch Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-semibold px-2">Select Models:</span>
          {watchKeys.map((key) => {
            const isSelected = selectedIds.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleWatch(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{allWatches[key].title}</span>
              </button>
            );
          })}
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-950/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-1/4">Specification</th>
                {selectedWatches.map((w) => (
                  <th key={w.id} className="p-4 text-center border-l border-zinc-800">
                    <div className="w-20 h-20 relative mx-auto mb-2 rounded-xl overflow-hidden border border-zinc-700">
                      <Image src={w.src} alt={w.title} fill className="object-cover" />
                    </div>
                    <p className="text-sm font-bold text-white leading-tight">{w.title}</p>
                    <span className="text-[10px] text-amber-400 font-mono">{w.date}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-900/20">Tagline</td>
                {selectedWatches.map((w) => (
                  <td key={w.id} className="p-4 text-center border-l border-zinc-800 text-zinc-300 font-light">
                    {w.tagline || 'Haute Horlogerie'}
                  </td>
                ))}
              </tr>
              {['Caliber Movement', 'Power Reserve', 'Water Resistance', 'Case Material', 'Crystal', 'Case Diameter'].map((label) => (
                <tr key={label}>
                  <td className="p-4 font-semibold text-zinc-400 bg-zinc-900/20">{label}</td>
                  {selectedWatches.map((w) => {
                    const specObj = w.specs?.find(s => s.label.toLowerCase() === label.toLowerCase());
                    return (
                      <td key={w.id} className="p-4 text-center border-l border-zinc-800 font-semibold text-white">
                        {specObj ? specObj.value : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-900/20">Key Innovation</td>
                {selectedWatches.map((w) => (
                  <td key={w.id} className="p-4 text-center border-l border-zinc-800 text-amber-300 font-medium">
                    {w.features?.[0]?.title || 'Precision Engineering'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors text-sm shadow-lg cursor-pointer"
        >
          Close Comparator
        </button>
      </div>
    </div>
  );
}

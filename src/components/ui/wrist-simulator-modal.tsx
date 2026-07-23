'use client';

import { useState } from 'react';
import { X, Sparkles, Sliders, CheckCircle2, Watch } from 'lucide-react';
import Image from 'next/image';

interface WristSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchTitle: string;
  watchSrc: string;
  caseDiameter: string;
}

export default function WristSimulatorModal({
  isOpen,
  onClose,
  watchTitle,
  watchSrc,
  caseDiameter,
}: WristSimulatorModalProps) {
  const [wristSize, setWristSize] = useState(17); // cm
  const [skinTone, setSkinTone] = useState('#d4a373'); // hex color

  if (!isOpen) return null;

  // Extract numeric diameter from "41mm Classic Fit" -> 41
  const numericDiameter = parseInt(caseDiameter) || 41;
  // Calculate relative watch visual scale based on wrist size (smaller wrist = watch appears larger)
  const relativeScale = Math.min(Math.max((numericDiameter / (wristSize * 2.2)) * 10, 0.75), 1.35);

  const skinTones = [
    { label: 'Fair', color: '#f5d0c5' },
    { label: 'Warm Sand', color: '#e0ac69' },
    { label: 'Olive / Tan', color: '#c68642' },
    { label: 'Deep Bronze', color: '#8d5524' },
    { label: 'Dark Ebony', color: '#3c2006' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Step 1: 3D Wrist Fit Simulator
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Watch className="w-6 h-6 text-amber-400" />
            Wrist Proportion Simulator
          </h3>
          <p className="text-xs text-zinc-400">
            Visualize how <span className="text-white font-medium">{watchTitle} ({caseDiameter})</span> proportions fit your wrist size.
          </p>
        </div>

        {/* Simulator Canvas */}
        <div className="relative w-full h-64 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden p-6">
          {/* Simulated Wrist Sleeve & Wrist */}
          <div className="relative flex items-center justify-center w-full">
            {/* Simulated Arm/Wrist Bar */}
            <div
              className="h-28 rounded-full shadow-inner transition-all duration-300 flex items-center justify-center relative border border-white/10"
              style={{
                width: `${wristSize * 24}px`,
                backgroundColor: skinTone,
              }}
            >
              {/* Watch Overlay */}
              <div 
                className="relative transition-transform duration-300 drop-shadow-2xl"
                style={{ transform: `scale(${relativeScale})` }}
              >
                <div className="w-32 h-32 relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <Image
                    src={watchSrc}
                    alt={watchTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 left-4 text-[10px] text-zinc-500 font-mono">
            Scale Ratio: {relativeScale.toFixed(2)}x • Case: {numericDiameter}mm
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800/80">
          {/* Wrist Size Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" /> Wrist Circumference
              </span>
              <span className="font-mono text-amber-300 font-bold">{wristSize} cm ({ (wristSize / 2.54).toFixed(1) } in)</span>
            </div>
            <input
              type="range"
              min="14"
              max="22"
              step="0.5"
              value={wristSize}
              onChange={(e) => setWristSize(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Slim (14cm)</span>
              <span>Medium (17cm)</span>
              <span>Large (22cm)</span>
            </div>
          </div>

          {/* Skin Tone Selector */}
          <div className="space-y-3">
            <span className="block text-xs font-semibold text-zinc-300">
              Skin Tone Preview
            </span>
            <div className="flex items-center gap-2">
              {skinTones.map((tone) => (
                <button
                  key={tone.color}
                  onClick={() => setSkinTone(tone.color)}
                  className={`w-7 h-7 rounded-full transition-all border cursor-pointer ${
                    skinTone === tone.color ? 'border-amber-400 scale-110 shadow-lg shadow-amber-500/20' : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: tone.color }}
                  title={tone.label}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors text-sm shadow-lg cursor-pointer"
        >
          Confirm Fit & Return to Showcase
        </button>
      </div>
    </div>
  );
}

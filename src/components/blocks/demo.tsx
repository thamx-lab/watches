'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { getWatches, WatchData } from '@/lib/api';
import VIPConsultationModal from '@/components/ui/vip-consultation-modal';
import AIDossierModal from '@/components/ui/ai-dossier-modal';
import CollectorClubSection from '@/components/ui/collector-club-section';
import { 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Zap, 
  Sparkles, 
  Clock, 
  Award, 
  Flame,
  Layers,
  Wrench,
  FileDown,
  Calendar
} from 'lucide-react';

const sampleMediaContent: Record<string, WatchData> = {
  classic: {
    id: 'classic',
    src: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1920&auto=format&fit=crop',
    title: 'Classic Heritage',
    date: 'Est. 1920',
    scrollToExpand: 'Scroll to Explore Heritage',
    tagline: 'A Century of Uncompromising Horological Excellence',
    about: {
      overview: 'Experience the pinnacle of traditional Swiss horological engineering. The Classic Heritage represents over a century of refined watchmaking traditions, hand-assembled by master artisans dedicated to perfection.',
      conclusion: 'Crafted for connoisseurs who appreciate the subtle poetry of mechanical perfection. Every tick is a tribute to timeless elegance.',
    },
    story: {
      heritage: 'Born in the high valleys of the Jura Mountains in 1920, the Classic Heritage was commissioned for pioneering aviators who required infallible precision under harsh conditions. Passed down across four generations of horologists, the design language has retained its iconic fluted bezel, hand-polished hands, and signature porcelain dial.',
      craftsmanship: 'Each movement undergoes over 300 hours of meticulous hand-finishing, featuring Côtes de Genève striping, perlage engraving on the mainplate, and hand-bevelled bridges visible through the sapphire exhibition caseback.',
      movementDetails: 'Powered by the Caliber AH-1920 in-house automatic mechanical movement, oscillating at 28,800 vibrations per hour (4Hz) with a variable-inertia balance wheel for superior chronometric stability.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'AH-1920 In-House Automatic' },
      { label: 'Power Reserve', value: '72 Hours (3 Days)' },
      { label: 'Water Resistance', value: '100m / 10 ATM' },
      { label: 'Case Material', value: '316L Surgical Stainless Steel & Rose Gold' },
      { label: 'Crystal', value: 'Double-Curved Scratch-Resistant Sapphire' },
      { label: 'Case Diameter', value: '41mm' }
    ],
    features: [
      {
        title: 'Hand-Finished Guilloché Dial',
        description: 'Featuring intricate sunburst patterning created using traditional rose-engine lathes dating back to the 19th century.',
        icon: 'Sparkles'
      },
      {
        title: 'Paramagnetic Blue Parachrom Hairspring',
        description: 'Unaffected by magnetic fields and up to 10 times more precise than traditional hairsprings in case of shocks.',
        icon: 'ShieldCheck'
      },
      {
        title: '72-Hour Continuous Power Reserve',
        description: 'Dual barrel architecture stores sufficient mechanical kinetic energy for over three consecutive days off the wrist.',
        icon: 'Clock'
      },
      {
        title: 'Artisanal Exhibition Caseback',
        description: 'Transparent anti-reflective sapphire glass reveals 27 ruby jewels and 22-karat gold winding rotor.',
        icon: 'Award'
      }
    ]
  },
  modern: {
    id: 'modern',
    src: 'https://images.unsplash.com/photo-1548169874-531866cb2832?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1920&auto=format&fit=crop',
    title: 'Modern Elegance',
    date: 'New Collection',
    scrollToExpand: 'Scroll to Discover Innovation',
    tagline: 'Avant-Garde Architecture Meets Aerospace Materials',
    about: {
      overview: 'A bold, futuristic statement engineered for the modern pioneer. Fusing aerospace titanium alloy construction with a high-frequency skeletonized movement.',
      conclusion: 'Designed for visionary leaders who command the future. Elevate your presence with a masterwork of modern industrial art.',
    },
    story: {
      heritage: 'Engineered at the intersection of haute horology and aerospace technology. The Modern Elegance was designed using advanced computational fluid dynamics to reduce overall casing mass while tripling structural impact resistance.',
      craftsmanship: 'Constructed from Grade 5 Titanium—the same alloy used in deep-space exploration craft. The skeletonized dial reveals an intricate matrix of PVD-coated bridges, carbon-composite tourbillon cage, and laser-carved indices.',
      movementDetails: 'Driven by the high-beat Caliber ME-X1 skeletonized movement running at 36,000 vph (5Hz), offering split-second precision and resistance to extreme G-forces.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'ME-X1 High-Frequency Skeleton' },
      { label: 'Power Reserve', value: '60 Hours' },
      { label: 'Water Resistance', value: '300m / 30 ATM Divers Certified' },
      { label: 'Case Material', value: 'Grade 5 Aerospace Titanium & Forged Carbon' },
      { label: 'Crystal', value: 'AR-Coated Synthetic Sapphire' },
      { label: 'Case Diameter', value: '43mm Ultra-Light' }
    ],
    features: [
      {
        title: 'Grade 5 Titanium Construction',
        description: 'Extremely lightweight, hypoallergenic, and corrosion-resistant casing with brushed matte DLC finish.',
        icon: 'Cpu'
      },
      {
        title: 'Super-LumiNova® C3 Illumination',
        description: 'Hands and indices filled with Swiss C3 photoluminescent coating for nighttime legibility underwater.',
        icon: 'Zap'
      },
      {
        title: 'Skeletonized Architectural Dial',
        description: 'Exposes the mechanical heart of the balance wheel and escapement in perpetual motion.',
        icon: 'Compass'
      },
      {
        title: 'High-Impact Shock Absorption',
        description: 'Integrated elastomer suspension system dampens up to 5,000G of sudden physical impacts.',
        icon: 'Flame'
      }
    ]
  },
};

const getFeatureIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-400" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-amber-400" />;
    case 'Clock': return <Clock className="w-6 h-6 text-amber-400" />;
    case 'Award': return <Award className="w-6 h-6 text-amber-400" />;
    case 'Cpu': return <Cpu className="w-6 h-6 text-cyan-400" />;
    case 'Zap': return <Zap className="w-6 h-6 text-cyan-400" />;
    case 'Compass': return <Compass className="w-6 h-6 text-cyan-400" />;
    case 'Flame': return <Flame className="w-6 h-6 text-cyan-400" />;
    default: return <Layers className="w-6 h-6 text-amber-400" />;
  }
};

interface MediaContentProps {
  data: WatchData;
  onOpenConsultation: () => void;
  onOpenDossier: () => void;
}

const MediaContent = ({ data, onOpenConsultation, onOpenDossier }: MediaContentProps) => {
  return (
    <div className='max-w-5xl mx-auto space-y-16 text-white text-left py-4'>
      {/* Header & Tagline */}
      <div className='text-center space-y-4 max-w-3xl mx-auto'>
        {data.tagline && (
          <span className='inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 text-amber-300 border border-white/15 backdrop-blur-md'>
            {data.tagline}
          </span>
        )}
        <h2 className='text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent'>
          The Story of {data.title}
        </h2>
        <p className='text-lg md:text-xl text-zinc-300 leading-relaxed font-light'>
          {data.about.overview}
        </p>

        {/* AI Action Triggers */}
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={onOpenDossier}
            className="px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 text-sm shadow-xl"
          >
            <FileDown className="w-4 h-4 text-amber-600" />
            Receive AI Watch Dossier
          </button>

          <button
            onClick={onOpenConsultation}
            className="px-6 py-3.5 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors flex items-center gap-2 text-sm shadow-xl shadow-amber-500/10"
          >
            <Calendar className="w-4 h-4" />
            Schedule VIP Consultation
          </button>
        </div>
      </div>

      {/* Heritage & Story Cards */}
      {data.story && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {data.story.heritage && (
            <div className='p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700/80 transition-all duration-300 shadow-2xl space-y-4'>
              <div className='flex items-center gap-3 text-amber-400 font-semibold uppercase tracking-wider text-sm'>
                <Clock className='w-5 h-5' />
                <span>Heritage & Origin</span>
              </div>
              <h3 className='text-2xl font-bold text-white'>Time-Honored Legacy</h3>
              <p className='text-zinc-400 leading-relaxed text-sm md:text-base font-light'>
                {data.story.heritage}
              </p>
            </div>
          )}

          {data.story.craftsmanship && (
            <div className='p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700/80 transition-all duration-300 shadow-2xl space-y-4'>
              <div className='flex items-center gap-3 text-amber-400 font-semibold uppercase tracking-wider text-sm'>
                <Wrench className='w-5 h-5' />
                <span>Artisan Craftsmanship</span>
              </div>
              <h3 className='text-2xl font-bold text-white'>Master Horology</h3>
              <p className='text-zinc-400 leading-relaxed text-sm md:text-base font-light'>
                {data.story.craftsmanship}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Specifications Grid */}
      {data.specs && data.specs.length > 0 && (
        <div className='space-y-6'>
          <div className='flex flex-col items-center text-center space-y-2'>
            <h3 className='text-2xl md:text-3xl font-bold tracking-tight text-white'>
              Technical Specifications
            </h3>
            <p className='text-zinc-400 text-sm'>Engineered to exact tolerances without compromise.</p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data.specs.map((spec, idx) => (
              <div 
                key={idx}
                className='p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 hover:border-amber-500/30 transition-all duration-300'
              >
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1'>
                  {spec.label}
                </p>
                <p className='text-base font-semibold text-zinc-100'>
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Innovation & Features */}
      {data.features && data.features.length > 0 && (
        <div className='space-y-8'>
          <div className='text-center space-y-2'>
            <h3 className='text-2xl md:text-3xl font-bold text-white'>
              Key Feature Highlights
            </h3>
            <p className='text-zinc-400 text-sm'>Discover the innovations that set this timepiece apart.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {data.features.map((feature, idx) => (
              <div 
                key={idx}
                className='p-6 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex items-start gap-4'
              >
                <div className='p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 shrink-0'>
                  {getFeatureIcon(feature.icon)}
                </div>
                <div className='space-y-2'>
                  <h4 className='text-lg font-bold text-white'>{feature.title}</h4>
                  <p className='text-sm text-zinc-400 leading-relaxed font-light'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movement Highlight Details */}
      {data.story?.movementDetails && (
        <div className='p-8 rounded-3xl bg-gradient-to-r from-amber-950/30 via-zinc-900/80 to-zinc-900/80 border border-amber-500/20 text-center space-y-4'>
          <h4 className='text-xl font-bold text-amber-300 uppercase tracking-widest text-xs'>
            In-House Movement Architecture
          </h4>
          <p className='text-lg md:text-xl text-zinc-200 font-light max-w-3xl mx-auto leading-relaxed'>
            "{data.story.movementDetails}"
          </p>
        </div>
      )}

      {/* AI Collector Club Subscription Section */}
      <CollectorClubSection />

      {/* Conclusion */}
      <div className='p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center max-w-3xl mx-auto space-y-4'>
        <h4 className='text-2xl font-bold text-white'>The Connoisseur's Choice</h4>
        <p className='text-zinc-300 text-lg leading-relaxed font-light'>
          {data.about.conclusion}
        </p>
      </div>
    </div>
  );
};

const Demo = () => {
  const [themeKey, setThemeKey] = useState<string>('classic');
  const [watches, setWatches] = useState<Record<string, WatchData>>(sampleMediaContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Fetch from Backend on Mount
  useEffect(() => {
    async function loadWatches() {
      const data = await getWatches();
      if (data && Object.keys(data).length > 0) {
        const merged: Record<string, WatchData> = {};
        for (const key of Object.keys(data)) {
          merged[key] = {
            ...sampleMediaContent[key],
            ...data[key],
            about: {
              ...sampleMediaContent[key]?.about,
              ...data[key]?.about,
            },
            story: {
              ...sampleMediaContent[key]?.story,
              ...data[key]?.story,
            },
            specs: data[key]?.specs || sampleMediaContent[key]?.specs,
            features: data[key]?.features || sampleMediaContent[key]?.features,
          };
        }
        setWatches(merged);
        if (!merged['classic']) {
          setThemeKey(Object.keys(merged)[0]);
        }
      }
      setIsLoading(false);
    }
    loadWatches();
  }, []);

  const currentMedia = watches[themeKey];

  useEffect(() => {
    if (isLoading || !currentMedia) return;
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [themeKey, isLoading, currentMedia]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading watch collections...</div>
      </div>
    );
  }

  if (!currentMedia) return null;

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        {Object.keys(watches).map((key) => (
          <button
            key={key}
            onClick={() => setThemeKey(key)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              themeKey === key
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'bg-black/50 text-white border border-white/30 hover:bg-white/10'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend={false}
      >
        <MediaContent 
          data={currentMedia} 
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpenDossier={() => setIsDossierOpen(true)}
        />
      </ScrollExpandMedia>

      {/* AI Email Automation Modals */}
      <VIPConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        watchTitle={currentMedia.title}
        watchId={currentMedia.id}
      />

      <AIDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        watchTitle={currentMedia.title}
        watchId={currentMedia.id}
      />
    </div>
  );
};

export default Demo;

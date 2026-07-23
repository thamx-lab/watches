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
    src: '/images/sample_watch.jpg',
    background: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1920&auto=format&fit=crop',
    title: 'Classic Heritage 1920',
    date: 'Est. 1920',
    scrollToExpand: 'Scroll to Explore Heritage',
    tagline: 'A Century of Traditional Swiss Horological Artistry',
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
      { label: 'Case Diameter', value: '41mm Classic Fit' }
    ],
    features: [
      {
        title: 'Hand-Engineered Guilloché Dial',
        description: 'Featuring intricate sunburst patterning created using traditional rose-engine lathes dating back to the 19th century.',
        icon: 'Sparkles'
      },
      {
        title: 'Paramagnetic Blue Parachrom Hairspring',
        description: 'Unaffected by magnetic fields and up to 10 times more precise than traditional hairsprings in case of shocks.',
        icon: 'ShieldCheck'
      },
      {
        title: '72-Hour Continuous Kinematic Reserve',
        description: 'Dual barrel architecture stores sufficient mechanical kinetic energy for over three consecutive days off the wrist.',
        icon: 'Clock'
      },
      {
        title: 'Artisanal Exhibition Sapphire Caseback',
        description: 'Transparent anti-reflective sapphire glass reveals 27 ruby jewels and 22-karat gold winding rotor.',
        icon: 'Award'
      }
    ]
  },
  rosegold: {
    id: 'rosegold',
    src: '/images/rose_gold_watch.jpg',
    background: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1920&auto=format&fit=crop',
    title: 'Royal Rose Gold Grand Complication',
    date: 'Royal Edition',
    scrollToExpand: 'Scroll to Discover Royal Complications',
    tagline: '18K Rose Gold Grand Complication & Astronomical Moonphase',
    about: {
      overview: 'Sculpted from solid 18-karat Sedna™ Rose Gold, this grand complication timepiece pairs an astronomical moonphase indicator with an ultra-slim coaxial mechanical movement.',
      conclusion: 'An heirloom-tier statement piece for royal galas and collectors of ultra-rare, high-complication horology.',
    },
    story: {
      heritage: 'Inspired by pocket watches crafted for European royalty in the late 19th century. The Royal Rose Gold collection captures the majesty of astronomical timekeeping with modern metallurgy.',
      craftsmanship: 'The 18K rose gold casing is hand-burnished using diamond-powder pastes to achieve a mirror finish that resists discoloration over decades of wear.',
      movementDetails: 'Driven by the RG-Moonphase Caliber 8800 with silicon balance spring and bi-directional automatic winding system storing 80 hours of power.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'RG-Moonphase Caliber 8800' },
      { label: 'Power Reserve', value: '80 Hours (Co-Axial)' },
      { label: 'Water Resistance', value: '50m / 5 ATM' },
      { label: 'Case Material', value: 'Solid 18K Sedna™ Rose Gold' },
      { label: 'Crystal', value: 'Anti-Reflective Double Sapphire' },
      { label: 'Case Diameter', value: '40mm Ultra-Slim Profile' }
    ],
    features: [
      {
        title: 'Astronomical Moonphase Indicator',
        description: 'Accurate to within one lunar day every 122 years, featuring a laser-ablated aventurine sky disc.',
        icon: 'Compass'
      },
      {
        title: 'Solid 18K Rose Gold Octagonal Bezel',
        description: 'Forged from proprietary gold alloy blended with copper and palladium for enduring reddish lustre.',
        icon: 'Award'
      },
      {
        title: 'Hand-Stitched Mississippi Alligator Strap',
        description: 'Lined with hypoallergenic calfskin and secured by an 18K gold folding safety clasp.',
        icon: 'Wrench'
      },
      {
        title: 'Anti-Magnetic Shielding to 15,000 Gauss',
        description: 'Non-ferrous movement components ensure flawless timekeeping near magnetic appliances and MRI machines.',
        icon: 'ShieldCheck'
      }
    ]
  },
  celestial: {
    id: 'celestial',
    src: '/images/blue_luxury_watch.jpg',
    background: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    title: 'Celestial Blue Tourbillon',
    date: 'Limited Edition',
    scrollToExpand: 'Scroll to Experience Tourbillon Mechanics',
    tagline: 'Flying Tourbillon Suspended in Deep Azure Sunburst',
    about: {
      overview: 'A breathtaking horological masterwork featuring a 60-second flying tourbillon suspended inside a deep blue guilloché dial, counteracting Earth gravity in real time.',
      conclusion: 'Limited to only 50 numbered pieces worldwide, offering unrivaled mechanical prestige and visual drama.',
    },
    story: {
      heritage: 'Developed to honor Abraham-Louis Breguet’s 1801 tourbillon invention, reimagined with lightweight titanium escapement cages and deep cosmic blue aesthetic.',
      craftsmanship: 'The tourbillon carriage alone weighs a mere 0.28 grams despite containing 67 micro-engineered titanium and gold components.',
      movementDetails: 'Operated by the Tourbillon Caliber T-60 running at 28,800 vph with twin barrels providing a massive 96-hour (4-day) continuous power reserve.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'Tourbillon Caliber T-60 Flying Cage' },
      { label: 'Power Reserve', value: '96 Hours (4 Days Continuous)' },
      { label: 'Water Resistance', value: '150m / 15 ATM' },
      { label: 'Case Material', value: 'Titanium & Cobalt Blue PVD Finish' },
      { label: 'Crystal', value: 'Domed AR Sapphire' },
      { label: 'Case Diameter', value: '42mm Sculpted Casing' }
    ],
    features: [
      {
        title: '60-Second Flying Tourbillon Cage',
        description: 'Rotates 360 degrees every minute to eliminate gravitational rate errors in vertical positions.',
        icon: 'Sparkles'
      },
      {
        title: 'Deep Azure Sunburst Enamel Dial',
        description: 'Hand-enameled with 12 layers of grand feu cobalt powder baked at 800°C for luminous depth.',
        icon: 'Flame'
      },
      {
        title: 'Titanium Alloy Ultra-Light Chassis',
        description: 'Reduces wrist fatigue while offering superior tensile strength against environmental stress.',
        icon: 'Cpu'
      },
      {
        title: 'High-Efficiency 22K Gold Kinetic Rotor',
        description: 'Heavy gold rim rotor maximizes kinetic energy transfer with every wrist motion.',
        icon: 'Zap'
      }
    ]
  },
  premium: {
    id: 'premium',
    src: '/images/premium_watch.jpg',
    background: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1920&auto=format&fit=crop',
    title: 'Obsidian Reserve Master',
    date: 'Tactical Edition',
    scrollToExpand: 'Scroll for Tactical Chronograph',
    tagline: 'Forged Carbon & High-Beat Flyback Chronograph',
    about: {
      overview: 'Engineered for extreme sports and tactical operations, combining a monolithic forged carbon case with a 36,000 vph high-frequency flyback chronograph.',
      conclusion: 'Uncompromising tactical durability meets precision split-second timing in a lightweight stealth aesthetic.',
    },
    story: {
      heritage: 'Tested in high-G endurance racing and offshore sailing events, where instantaneous chronograph resets are required without stopping the mechanism.',
      craftsmanship: 'Forged carbon fiber is compressed under 300 bar of pressure and 1,000°C heat, producing a unique marbleized pattern for every individual watch casing.',
      movementDetails: 'High-beat Chrono-Master Flyback Caliber 400 oscillating at 5Hz (36,000 vph), measuring elapsed time down to 1/10th of a second.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'Chrono-Master Flyback Caliber 400' },
      { label: 'Power Reserve', value: '50 Hours' },
      { label: 'Water Resistance', value: '200m / 20 ATM Tactical' },
      { label: 'Case Material', value: 'Forged Carbon & Matte Black Ceramic' },
      { label: 'Crystal', value: 'Tactical Matte Sapphire' },
      { label: 'Case Diameter', value: '44mm Ergonomic' }
    ],
    features: [
      {
        title: 'Flyback Chronograph Reset System',
        description: 'Allows instantaneous resetting and restarting of the stopwatch with a single push of the lower pusher.',
        icon: 'Zap'
      },
      {
        title: 'Ceramic Tachymeter Bezel',
        description: 'Laser-engraved bezel scale measures speed over distance up to 500 units per hour.',
        icon: 'Compass'
      },
      {
        title: 'Monolithic Forged Carbon Composite Shell',
        description: '30% lighter than titanium while delivering unmatched scratch and impact dampening properties.',
        icon: 'Cpu'
      },
      {
        title: 'Viton® Fluoroelastomer Tactical Band',
        description: 'Resistant to UV rays, salt water, and chemical exposure with quick-release spring bars.',
        icon: 'Wrench'
      }
    ]
  },
  submariner: {
    id: 'submariner',
    src: '/images/blue_watch_standing.jpg',
    background: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop',
    title: 'Submariner Deep Sea Diver',
    date: 'Oceanic Series',
    scrollToExpand: 'Scroll to Explore Deep Diving Specs',
    tagline: '300m Certified Diver with Automatic Helium Escape Valve',
    about: {
      overview: 'Built for deep marine exploration, the Submariner Deep Sea features a ISO 6425 diver certification, 300-meter water resistance, and an automatic helium escape valve.',
      conclusion: 'The ultimate oceanic companion, trusted by saturation divers and underwater explorers around the world.',
    },
    story: {
      heritage: 'Crafted in collaboration with oceanic research vessels to withstand extreme hydrostatic pressures at depths over 1,000 feet below sea level.',
      craftsmanship: 'The 904L stainless steel alloy contains higher chromium and molybdenum levels, preventing pitting and seawater corrosion even after years of marine immersion.',
      movementDetails: 'Driven by the robust Deep-Sea Caliber 3000 with reinforced shock absorbers and paraflex anti-shock springs.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'Deep-Sea Caliber 3000 Automatic' },
      { label: 'Power Reserve', value: '65 Hours' },
      { label: 'Water Resistance', value: '300m / 30 ATM ISO 6425 Certified' },
      { label: 'Case Material', value: '904L Marine-Grade Stainless Steel' },
      { label: 'Crystal', value: '4.5mm Extra-Thick Sapphire' },
      { label: 'Case Diameter', value: '43mm Diver Profile' }
    ],
    features: [
      {
        title: 'Unidirectional 120-Click Ceramic Bezel',
        description: 'Engraved with 60-minute graduation scale for safe dive time tracking without accidental backward movement.',
        icon: 'Compass'
      },
      {
        title: 'Automatic Helium Escape Valve',
        description: 'Allows trapped helium gas to vent during deep decompression chambers, preventing crystal ejection.',
        icon: 'Flame'
      },
      {
        title: 'Super-LumiNova® Blue Glow Illumination',
        description: 'Emits a brilliant long-lasting cyan glow in zero-light deep underwater conditions.',
        icon: 'Zap'
      },
      {
        title: 'GlideLock Diver Extension Bracelet',
        description: 'Adjusts in 2mm increments up to 20mm to fit comfortably over thick neoprene wet suits.',
        icon: 'ShieldCheck'
      }
    ]
  },
  aviator: {
    id: 'aviator',
    src: '/images/blue_watch_no_stand.jpg',
    background: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1920&auto=format&fit=crop',
    title: 'Aviator Precision GMT Chronometer',
    date: 'Pilot Series',
    scrollToExpand: 'Scroll for Aviation Slide Rule',
    tagline: 'Dual Timezone 24H GMT & Circular Flight Calculator',
    about: {
      overview: 'Designed for transcontinental pilots and global travelers, featuring an independent 24-hour GMT hand and a bi-directional slide rule bezel for flight calculations.',
      conclusion: 'Master the skies and navigate timezones effortlessly with legendary cockpit legibility.',
    },
    story: {
      heritage: 'Inspired by mid-century commercial aviation flight chronometers used by trans-Atlantic pilots to calculate fuel consumption, air speed, and flight times.',
      craftsmanship: 'Features a soft-iron inner cage enclosing the movement to shield delicate hairsprings against cockpit radar and electronic cockpit magnetic radiation.',
      movementDetails: 'Powered by the Pilot GMT Caliber 24H with quickset local hour hand adjustment that changes timezones without stopping the seconds hand.'
    },
    specs: [
      { label: 'Caliber Movement', value: 'Pilot GMT Caliber 24H' },
      { label: 'Power Reserve', value: '70 Hours' },
      { label: 'Water Resistance', value: '100m / 10 ATM' },
      { label: 'Case Material', value: 'Satin-Brushed 316L Steel & Cobalt Dial' },
      { label: 'Crystal', value: 'Convex Anti-Glare Sapphire' },
      { label: 'Case Diameter', value: '42mm Cockpit Ergonomics' }
    ],
    features: [
      {
        title: 'Independent 24-Hour GMT Second Timezone',
        description: 'Displays home time and local destination time simultaneously with red-tipped GMT arrow.',
        icon: 'Clock'
      },
      {
        title: 'Circular Aviation Slide-Rule Bezel',
        description: 'Computes multiplication, division, fuel consumption rate, and unit conversions directly on your wrist.',
        icon: 'Compass'
      },
      {
        title: 'High-Contrast Cockpit Dial Legibility',
        description: 'Matte blue dial with oversized Arabic numerals and syringe hands for instant split-second reading.',
        icon: 'Sparkles'
      },
      {
        title: 'Soft-Iron Anti-Magnetic Inner Cage',
        description: 'Surrounds the movement to isolate delicate balance springs from cockpit electronic interference.',
        icon: 'ShieldCheck'
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
            className="px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 text-sm shadow-xl cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-amber-600" />
            Receive AI Watch Dossier
          </button>

          <button
            onClick={onOpenConsultation}
            className="px-6 py-3.5 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors flex items-center gap-2 text-sm shadow-xl shadow-amber-500/10 cursor-pointer"
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
              Distinct Feature Highlights
            </h3>
            <p className='text-zinc-400 text-sm'>Discover the bespoke engineering and innovations unique to this model.</p>
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
      <div className='fixed top-4 right-4 z-50 flex flex-wrap gap-2 max-w-xl justify-end'>
        {Object.keys(watches).map((key) => (
          <button
            key={key}
            onClick={() => setThemeKey(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all capitalize shadow-md cursor-pointer ${
              themeKey === key
                ? 'bg-white text-black scale-105 shadow-xl'
                : 'bg-black/60 text-white border border-white/20 hover:bg-white/10 backdrop-blur-md'
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

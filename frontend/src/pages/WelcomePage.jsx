import React from 'react';
import { 
  Mic, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Building, 
  MapPin, 
  CheckCircle2, 
  Layers, 
  Search,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WelcomePage({ setActiveTab }) {
  const { user } = useAuth();

  const audiencePillars = [
    {
      title: 'Discerning Buyers',
      tagline: 'Ancestral Estates & Coastal Villas',
      description: 'Find verified Portuguese heritage villas and sea-view residences with zero ambiguity regarding title continuity.',
      highlight: 'Voice Search & 30-Yr RoR Verification'
    },
    {
      title: 'Sellers & Landowners',
      tagline: 'Accredited Market Valuation',
      description: 'Pre-screen your Form I & XIV before listing, obtain instant micro-market comp pricing, and receive verified WhatsApp cash offers.',
      highlight: 'Automated Comp AVM & Instant Bids'
    },
    {
      title: 'Institutional Investors',
      tagline: 'High-Yield Alpha in Goa Corridors',
      description: 'Model net rental yields, 60% LTV Cash-on-Cash returns, seasonal occupancy, and Mopa Airport infrastructure catalysts.',
      highlight: 'Predictive Yields & CAGR Forecasting'
    },
    {
      title: 'Elite Real Estate Brokers',
      tagline: 'Cadastral BhuNaksha Intelligence',
      description: 'Access official Goa cadastral polygon sheets overlapping high-res satellite imagery to eliminate land boundary disputes.',
      highlight: 'DSLR BhuNaksha Cadastral Overlay'
    }
  ];

  return (
    <div className="bg-alabaster-50 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#102542] text-white pt-20 pb-28 border-b border-coral/20">
        
        {/* Subtle Luxury Pattern / Gradient Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f87060_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/4 -right-28 w-96 h-96 bg-coral/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-khaki/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Editorial Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-coral/30 text-xs font-semibold text-coral tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen RAG & AI Real Estate Platform</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Where Goa’s Heritage <br />
                <span className="text-coral">Meets Artificial Intelligence.</span>
              </h1>

              <p className="text-alabaster text-lg leading-relaxed max-w-2xl font-light">
                KSHETRAM is an intelligent real estate ecosystem designed for Buyers, Sellers, Institutional Investors, and Agents. Seamlessly combining natural language voice search, hyper-local automated comp valuation, Form I & XIV title link audits, and BhuNaksha cadastral satellite overlays.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveTab(user ? 'home' : 'auth')}
                  className="px-8 py-4 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-sm tracking-wider uppercase shadow-coral-glow hover:shadow-lg transition-all flex items-center space-x-2 group"
                >
                  <span>{user ? 'Enter AI Dashboard' : 'Sign In / Create Account'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm tracking-wide border border-white/20 transition-all flex items-center space-x-2"
                >
                  <Compass className="w-4 h-4 text-coral" />
                  <span>Explore Verified Estates</span>
                </button>

                <button
                  onClick={() => setActiveTab('investor')}
                  className="px-6 py-4 rounded-xl text-alabaster hover:text-white font-semibold text-sm transition-all flex items-center space-x-1.5"
                >
                  <TrendingUp className="w-4 h-4 text-khaki" />
                  <span>Institutional Portal</span>
                </button>
              </div>

              {/* Quick Trust Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-alabaster-300">
                <div>
                  <div className="font-serif text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-alabaster-400">Title Pre-Audited</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-coral">₹34,000</div>
                  <div className="text-xs text-alabaster-400">Peak Assagao Rate/SqFt</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-white">DSLR</div>
                  <div className="text-xs text-alabaster-400">BhuNaksha Cadastral Sync</div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Luxury Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white/5 border border-white/15 p-6 backdrop-blur-xl shadow-luxury">
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-coral animate-ping"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-coral">
                      Live AI Agent Active
                    </span>
                  </div>
                  <span className="text-xs text-alabaster-400 font-mono">Assagao Micro-Market</span>
                </div>

                {/* Simulated Voice Query Preview */}
                <div className="bg-[#102542]/80 rounded-xl p-4 border border-coral/30 mb-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-alabaster">
                    <Mic className="w-4 h-4 text-coral animate-pulse" />
                    <span>User Natural Voice Query:</span>
                  </div>
                  <p className="text-sm italic font-serif text-white">
                    "Find heritage villas in Assagao with verified titles under ₹7 Cr"
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-[10px] bg-coral/20 text-coral px-2 py-0.5 rounded font-mono border border-coral/30">
                      Location: Assagao
                    </span>
                    <span className="text-[10px] bg-white/10 text-alabaster px-2 py-0.5 rounded font-mono">
                      Type: Heritage Villa
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      RoR: Verified Only
                    </span>
                    <span className="text-[10px] bg-white/10 text-alabaster px-2 py-0.5 rounded font-mono">
                      Max: ₹7.00 Cr
                    </span>
                  </div>
                </div>

                {/* Instant Comp Valuation Match */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">Casa dos Sonhos</h4>
                      <p className="text-xs text-alabaster-400">Survey 142/6, Badem-Assagao</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-500/30">
                      Pre-Audit 100/100
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-alabaster">Listed Price</span>
                    <span className="font-serif text-xl font-bold text-coral">₹6.85 Cr</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                    <div className="bg-[#102542]/60 p-2 rounded border border-white/5">
                      <div className="text-alabaster-400 text-[10px]">Net Rental Yield</div>
                      <div className="font-bold text-white">6.9%</div>
                    </div>
                    <div className="bg-[#102542]/60 p-2 rounded border border-white/5">
                      <div className="text-alabaster-400 text-[10px]">Cash-on-Cash (60% LTV)</div>
                      <div className="font-bold text-coral">11.4%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs text-alabaster hover:text-coral transition-colors font-medium flex items-center justify-center space-x-1 w-full"
                  >
                    <span>Test Full RAG & Valuation in Home Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Four User Archetypes (Target Personas) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-coral bg-coral-50 px-3 py-1 rounded-full border border-coral-200">
            Tailored For The Entire Ecosystem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-prussian mt-3">
            Architected for Every Participant in Luxury Real Estate
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Whether you are acquiring a generational heritage residence, selling high-value ancestral land, or modeling private equity yields, Kshetram provides automated confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiencePillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-alabaster shadow-prussian-card hover:shadow-luxury hover:border-coral transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-alabaster-100 text-prussian flex items-center justify-center font-serif font-bold text-lg mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-xl font-bold text-prussian">{pillar.title}</h3>
                <p className="text-xs font-semibold text-coral mt-1 tracking-wide">{pillar.tagline}</p>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-alabaster-100 flex items-center justify-between text-xs">
                <span className="font-medium text-prussian-700">{pillar.highlight}</span>
                <CheckCircle2 className="w-4 h-4 text-coral" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The 4 Proprietary Core Pillars (Home Section Showcase) */}
      <section className="py-20 bg-white border-y border-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-coral">
                Proprietary AI Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-prussian mt-2">
                Four Pillars of the Kshetram Platform
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-coral font-bold text-sm hover:underline"
            >
              <span>Explore All 4 Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1: Voice Search */}
            <div className="bg-alabaster-50 p-8 rounded-2xl border border-alabaster hover:border-coral transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#102542] text-coral flex items-center justify-center shadow-md">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-prussian">1. Voice Search & RAG Parser</h3>
                  <p className="text-xs text-gray-500">Natural Language Audio & Speech Recognition</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Speak naturally without wrestling complex dropdowns. Say *"Find heritage villas in Assagao with verified titles under ₹7 Cr"* and the RAG engine immediately resolves geographic intent, legal status, and price constraints.
              </p>
              <div className="bg-white p-3 rounded-lg border border-alabaster text-xs text-gray-700 font-mono">
                Prompt: "3BHK pool villa near Chapora river with low liquidity risk"
              </div>
            </div>

            {/* Pillar 2: AVM Model */}
            <div className="bg-alabaster-50 p-8 rounded-2xl border border-alabaster hover:border-coral transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#102542] text-coral flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-prussian">2. Automated Valuation Model (AVM)</h3>
                  <p className="text-xs text-gray-500">Hyper-Local Comps & Multi-Portal Scraping Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Instant statistical comp valuation based on micro-market square-foot trends, heritage premiums, and pool multipliers. Automatically compares estimated prices across MagicBricks, 99acres, and Housing.com benchmarks.
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-700">
                <span className="font-semibold text-prussian">Integrated Portals:</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">MagicBricks</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">99acres</span>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 font-bold">Housing.com</span>
              </div>
            </div>

            {/* Pillar 3: Document Vault Pre-Audit */}
            <div className="bg-alabaster-50 p-8 rounded-2xl border border-alabaster hover:border-coral transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#102542] text-coral flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-prussian">3. Document Vault Pre-Audit</h3>
                  <p className="text-xs text-gray-500">Goa Form I & XIV and Form D Mutation Resolution</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Pre-screens land records before listing or purchasing. Automatically detects unrecorded deceased ancestors (Portuguese Civil Code succession gaps), Mundkar tenancy claims, and active bank hypothecations.
              </p>
              <div className="bg-white p-3 rounded-lg border border-alabaster text-xs text-emerald-800 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Generates an Audit Health Score (0-100) and step-by-step legal resolution roadmap.</span>
              </div>
            </div>

            {/* Pillar 4: BhuNaksha Cadastral */}
            <div className="bg-alabaster-50 p-8 rounded-2xl border border-alabaster hover:border-coral transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#102542] text-coral flex items-center justify-center shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-prussian">4. BhuNaksha Cadastral Overlays</h3>
                  <p className="text-xs text-gray-500">Directorate of Settlement & Land Records (DSLR) Goa</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Input GPS coordinates or select District, Taluka, Village, Sheet No and Survey No to render cadastral boundaries overlapping high-definition satellite Google Maps, with FAR guidelines and parcel boundaries.
              </p>
              <div className="bg-white p-3 rounded-lg border border-alabaster text-xs text-gray-700 flex items-center justify-between">
                <span>Official DSLR Portal Link:</span>
                <span className="font-mono text-coral font-bold">bhunaksha.goa.gov.in</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Ready to Experience Banner */}
      <section className="py-16 bg-[#102542] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Experience the Future of Goa Real Estate Today.
          </h2>
          <p className="text-alabaster text-base max-w-2xl mx-auto font-light leading-relaxed">
            Sign up to list properties with company branding, place cash offers with automated seller WhatsApp alerts, and conduct real-time title pre-audits.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('auth')}
              className="px-8 py-4 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-sm tracking-wider uppercase shadow-coral-glow transition-all"
            >
              Sign Up or Log In
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider uppercase border border-white/20 transition-all"
            >
              Launch Live App
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}


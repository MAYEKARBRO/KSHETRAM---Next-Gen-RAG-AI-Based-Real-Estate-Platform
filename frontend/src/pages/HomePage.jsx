import React, { useState } from 'react';
import VoiceSearch from '../components/VoiceSearch';
import AVMValuation from '../components/AVMValuation';
import DocumentVaultAudit from '../components/DocumentVaultAudit';
import BhuNakshaViewer from '../components/BhuNakshaViewer';
import ComparisonMatrix from '../components/ComparisonMatrix';
import { useProperty } from '../context/PropertyContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Mic, 
  MapPin, 
  Scale,
  Calculator,
  FileCheck,
  Layers,
  ChevronRight,
  Bot
} from 'lucide-react';

export default function HomePage({ setActiveTab }) {
  const { markedForComparison } = useProperty();
  const [activeModule, setActiveModule] = useState('voice'); // 'voice', 'avm', 'vault', 'bhunaksha', 'comparison', 'all'

  const moduleTabs = [
    {
      id: 'voice',
      label: 'Voice Search',
      shortDesc: 'Search by voice in plain English',
      icon: Mic,
      tag: 'AI NLP'
    },
    {
      id: 'avm',
      label: 'Instant Valuation',
      shortDesc: 'Calculate fair market value & comps',
      icon: Calculator,
      tag: 'AVM'
    },
    {
      id: 'vault',
      label: 'Land Title Audit',
      shortDesc: 'Pre-screen Form I & XIV land records',
      icon: FileCheck,
      tag: 'Legal Audit'
    },
    {
      id: 'bhunaksha',
      label: 'BhuNaksha Cadastre',
      shortDesc: 'Cadastral parcel on satellite map',
      icon: MapPin,
      tag: 'Govt Portal'
    },
    {
      id: 'comparison',
      label: `Compare (${markedForComparison.length})`,
      shortDesc: 'Side-by-side financial comparison',
      icon: Scale,
      tag: markedForComparison.length > 0 ? 'Active' : 'Empty'
    },
    {
      id: 'all',
      label: 'View All Tools',
      shortDesc: 'Show all 5 modules in one page',
      icon: Layers,
      tag: 'Complete'
    }
  ];

  return (
    <div className="bg-alabaster-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Simple & Clean Header Banner */}
        <div className="bg-[#102542] rounded-3xl p-6 sm:p-8 text-white shadow-luxury relative overflow-hidden border border-coral/20">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-coral text-xs font-bold uppercase tracking-wider border border-coral/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KSHETRAM Real Estate Workspace</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              AI Tools for Goa Luxury & Land Property
            </h1>

            <p className="text-alabaster text-xs sm:text-sm leading-relaxed font-normal">
              Select a tool below to quickly value a property, check official land records (Form I & XIV), overlay survey boundaries on Google Maps, or search with natural voice commands.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-5 py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center space-x-2"
              >
                <span>Browse All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('maps')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider border border-white/20 transition-all flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-coral" />
                <span>Open Map View</span>
              </button>

              <button
                onClick={() => setActiveTab('chatbot')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-coral/30 to-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider border border-coral/40 transition-all flex items-center space-x-2 shadow-sm"
              >
                <Bot className="w-4 h-4 text-coral" />
                <span>Ask AI Land Advisor</span>
              </button>
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Clean Interactive Module Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Choose an AI Tool to Use
            </h2>
            <span className="text-xs text-coral font-medium hidden sm:inline">
              Click any tool to focus on it
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {moduleTabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = activeModule === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-white border-coral shadow-luxury ring-2 ring-coral/20'
                      : 'bg-white hover:bg-alabaster-50 border-alabaster shadow-sm hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-coral text-white shadow-coral-glow' : 'bg-alabaster-100 text-prussian group-hover:text-coral'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-coral/10 text-coral' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.tag}
                    </span>
                  </div>

                  <div>
                    <div className={`text-xs font-bold font-serif ${isSelected ? 'text-coral' : 'text-prussian'}`}>
                      {tab.label}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {tab.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Display */}
        <div className="space-y-10">
          
          {/* 1. Voice Search */}
          {(activeModule === 'voice' || activeModule === 'all') && (
            <section id="voice-search" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-coral">
                    Tool 1 • Voice & Natural Language Search
                  </h3>
                  <p className="text-xs text-gray-500">
                    Search properties using your natural voice or type query constraints like price, location & title status.
                  </p>
                </div>
              </div>
              <VoiceSearch />
            </section>
          )}

          {/* 2. Automated Valuation Model (AVM) */}
          {(activeModule === 'avm' || activeModule === 'all') && (
            <section id="avm" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-coral">
                    Tool 2 • Automated Valuation Model (AVM)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Instantly estimate fair market value based on built-up area and compare prices against public aggregator listings.
                  </p>
                </div>
              </div>
              <AVMValuation />
            </section>
          )}

          {/* 3. Document Vault Pre-Audit */}
          {(activeModule === 'vault' || activeModule === 'all') && (
            <section id="document-vault" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-coral">
                    Tool 3 • Document Vault Pre-Audit
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pre-screen Form I & XIV land records to detect missing title links, tenant encumbrances, and partition issues.
                  </p>
                </div>
              </div>
              <DocumentVaultAudit />
            </section>
          )}

          {/* 4. Property Verification with BhuNaksha */}
          {(activeModule === 'bhunaksha' || activeModule === 'all') && (
            <section id="bhunaksha" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-coral">
                    Tool 4 • Goa BhuNaksha Cadastral Verification
                  </h3>
                  <p className="text-xs text-gray-500">
                    Inspect cadastral parcel boundaries overlaid atop high-resolution satellite imagery using official Goa survey numbers.
                  </p>
                </div>
              </div>
              <BhuNakshaViewer />
            </section>
          )}

          {/* 5. Marked Properties Comparison Matrix */}
          {(activeModule === 'comparison' || activeModule === 'all') && (
            <section id="comparison" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-coral">
                    Tool 5 • Multi-Property Comparison
                  </h3>
                  <p className="text-xs text-gray-500">
                    Compare Cap Rates, Cash-on-Cash yields, square footage, and title continuity side-by-side.
                  </p>
                </div>
              </div>
              <ComparisonMatrix onExploreMore={() => setActiveTab('explore')} />
            </section>
          )}

        </div>

      </div>
    </div>
  );
}

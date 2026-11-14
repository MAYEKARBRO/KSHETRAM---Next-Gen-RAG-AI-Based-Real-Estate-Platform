import React, { useState } from 'react';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  TrendingUp,
  MapPin,
  Scale
} from 'lucide-react';
import { FORMAT_CURRENCY } from '../lib/sampleData';

export default function ExplorePage({ setActiveTab }) {
  const { 
    filteredProperties, 
    activeFilters, 
    setActiveFilters, 
    markedForComparison 
  } = useProperty();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const microMarkets = [
    'All Locations',
    'Assagao',
    'Anjuna',
    'Vagator',
    'Siolim',
    'Aldona',
    'Porvorim',
    'Morjim',
    'Candolim'
  ];

  const resetFilters = () => {
    setActiveFilters({
      microMarket: 'All Locations',
      propertyType: 'all',
      minPrice: 0,
      maxPrice: 150000000,
      minCapRate: 0,
      minCashOnCash: 0,
      liquidityRisk: 'all',
      verifiedOnly: false,
      query: ''
    });
  };

  return (
    <div className="bg-alabaster-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-coral">
              Curated Goa Real Estate Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-prussian mt-1">
              Explore Verified Properties
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Filter by micro-market, budget, Cap Rate, Cash-on-Cash yield, and Title Verification status.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {markedForComparison.length > 0 && (
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-[#102542] hover:bg-[#1b2d4e] text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md"
              >
                <Scale className="w-4 h-4 text-coral" />
                <span>Compare Marked ({markedForComparison.length})</span>
              </button>
            )}

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2 rounded-xl bg-white border border-alabaster text-prussian text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-coral" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search & Main Filter Controls Panel */}
        <div className="bg-white rounded-2xl p-6 border border-alabaster shadow-luxury space-y-5">
          
          {/* Top Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={activeFilters.query}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search by keywords: 'Portuguese pool villa', 'Assagao badem', 'Riverfront Siolim'..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-alabaster focus:outline-none focus:border-coral text-sm bg-alabaster-50/50"
            />
          </div>

          {/* Grid Filters */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${showMobileFilters ? 'block' : 'hidden lg:grid'}`}>
            
            {/* 1. Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-prussian mb-1.5">
                Micro-Market Location
              </label>
              <select
                value={activeFilters.microMarket}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, microMarket: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs font-medium bg-white focus:outline-none focus:border-coral"
              >
                {microMarkets.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* 2. Budget Max Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-prussian">
                  Budget (Max)
                </label>
                <span className="text-xs font-mono font-bold text-coral">
                  {FORMAT_CURRENCY(activeFilters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="20000000"
                max="150000000"
                step="5000000"
                value={activeFilters.maxPrice}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) }))}
                className="w-full accent-coral cursor-pointer"
              />
            </div>

            {/* 3. Cash-on-Cash Return (60% LTV) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-prussian">
                  Min Cash-on-Cash
                </label>
                <span className="text-xs font-mono font-bold text-coral">
                  {activeFilters.minCashOnCash}%+
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={activeFilters.minCashOnCash}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, minCashOnCash: parseFloat(e.target.value) }))}
                className="w-full accent-coral cursor-pointer"
              />
            </div>

            {/* 4. Cap Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-prussian">
                  Min Cap Rate
                </label>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {activeFilters.minCapRate}%+
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={activeFilters.minCapRate}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, minCapRate: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

          </div>

          {/* Quick Badges Filter Bar */}
          <div className="pt-4 border-t border-alabaster flex flex-wrap items-center justify-between gap-3 text-xs">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 font-semibold mr-1">Toggles:</span>

              {/* Verified Title Only */}
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                className={`px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 transition-all ${
                  activeFilters.verifiedOnly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-alabaster-100 text-gray-700 hover:bg-alabaster-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified RoR Title Only</span>
              </button>

              {/* Liquidity Risk Selector */}
              <div className="inline-flex rounded-full bg-alabaster-100 p-0.5 border border-alabaster">
                {['all', 'Low', 'Moderate'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setActiveFilters(prev => ({ ...prev, liquidityRisk: risk }))}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${
                      activeFilters.liquidityRisk === risk
                        ? 'bg-[#102542] text-white shadow'
                        : 'text-gray-600 hover:text-prussian'
                    }`}
                  >
                    {risk === 'all' ? 'All Risks' : `${risk} Risk`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-coral transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>

          </div>

        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing <strong className="text-prussian">{filteredProperties.length}</strong> luxury estate listings in Goa
          </div>
          {activeFilters.microMarket !== 'All Locations' && (
            <span className="font-semibold text-coral">
              Filtered for: {activeFilters.microMarket}
            </span>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-alabaster shadow-sm">
            <h3 className="font-serif text-xl font-bold text-prussian">No Estates Matched Your Exact Criteria</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Try adjusting your max price slider or turning off specific filters like verified-only to see more properties.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


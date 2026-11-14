import React, { useState } from 'react';
import { calculateAVM } from '../lib/api';
import { 
  TrendingUp, 
  Sparkles, 
  Building2, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  DollarSign, 
  BarChart3,
  ExternalLink
} from 'lucide-react';

export default function AVMValuation() {
  const [microMarket, setMicroMarket] = useState('Assagao');
  const [builtUpSqft, setBuiltUpSqft] = useState(3200);
  const [propertyType, setPropertyType] = useState('villa');
  const [bedrooms, setBedrooms] = useState(4);
  const [hasPrivatePool, setHasPrivatePool] = useState(true);
  const [isHeritage, setIsHeritage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default initial valuation state
  const [valuationResult, setValuationResult] = useState({
    microMarket: 'Assagao',
    propertyType: 'villa',
    builtUpSqft: 3200,
    pricePerSqft: 27700,
    estimatedValuation: 88640000, // ₹8.86 Cr
    lowRange: 81548800,
    highRange: 97504000,
    marketTrends: {
      avgPricePerSqft: 26500,
      annualAppreciation: 18.2,
      demandIndex: 'Extremely High',
      investorSentiment: 'Bullish (HNI Luxury Focus)',
      rentalYieldAvg: 6.8
    },
    crossPlatformComparisons: [
      {
        portal: 'MagicBricks',
        portalColor: '#d8232a',
        avgMicroMarketRate: 25970,
        estimatedValue: 86867200,
        variancePercent: -2.0,
        confidenceScore: 92,
        sampleSize: 42,
        dataSource: 'MagicBricks Goa Micro-Market PropIndex'
      },
      {
        portal: '99acres',
        portalColor: '#0062b1',
        avgMicroMarketRate: 27295,
        estimatedValue: 91299200,
        variancePercent: +3.0,
        confidenceScore: 89,
        sampleSize: 37,
        dataSource: '99acres Price Insights & Listed Comps'
      },
      {
        portal: 'Housing.com',
        portalColor: '#00bfa5',
        avgMicroMarketRate: 26765,
        estimatedValue: 89526400,
        variancePercent: +1.0,
        confidenceScore: 94,
        sampleSize: 51,
        dataSource: 'Housing.com City Trends & Verified Units'
      }
    ],
    recentComparableSales: [
      {
        name: 'Portuguese 4BHK Estate, Assagao',
        areaSqft: 3200,
        soldPrice: 85980000,
        ratePerSqft: 26868,
        transactionDate: '2 months ago',
        titleStatus: 'Verified (Deed of Succession Registered)'
      },
      {
        name: 'Modern Gated Pool Villa, Assagao',
        areaSqft: 2900,
        soldPrice: 80662400,
        ratePerSqft: 27814,
        transactionDate: '4 months ago',
        titleStatus: 'Pre-Audit Passed'
      }
    ]
  });

  const handleCalculate = async () => {
    setLoading(true);
    const result = await calculateAVM({
      microMarket,
      builtUpSqft: parseFloat(builtUpSqft),
      propertyType,
      bedrooms: parseInt(bedrooms),
      hasPrivatePool,
      isHeritage
    });

    if (result) {
      setValuationResult(result);
    }
    setLoading(false);
  };

  const formatCr = (amount) => {
    if (!amount) return '₹0';
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-alabaster shadow-luxury">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-alabaster gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
              02
            </span>
            <h3 className="font-serif text-2xl font-bold text-prussian">
              Automated Valuation Model (AVM)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Instant hyper-local valuation engine with multi-portal public listing benchmark comparisons (MagicBricks, 99acres, Housing.com).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-prussian bg-alabaster-100 px-3 py-1 rounded-full border border-alabaster">
            Multi-Platform Comp Scraper
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Micro-Market */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-prussian mb-1.5">
              Goa Micro-Market Corridor
            </label>
            <select
              value={microMarket}
              onChange={(e) => setMicroMarket(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-alabaster bg-alabaster-50/50 text-sm font-semibold text-prussian focus:outline-none focus:border-coral"
            >
              <option value="Assagao">Assagao (Prime Heritage Boulevard)</option>
              <option value="Anjuna">Anjuna (Coastal & Sunset Strip)</option>
              <option value="Vagator">Vagator (Ozran Beach & Boutique)</option>
              <option value="Siolim">Siolim (Riverfront High-Growth)</option>
              <option value="Aldona">Aldona (Ancestral River Quinta)</option>
              <option value="Porvorim">Porvorim (Capital Strategic Hub)</option>
              <option value="Morjim">Morjim (Mopa Airport Corridor)</option>
              <option value="Candolim">Candolim (Mature Tourism Strip)</option>
            </select>
          </div>

          {/* Built-Up Area */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-prussian">
                Built-Up Area (Sq. Ft)
              </label>
              <span className="text-xs font-mono font-bold text-coral">{builtUpSqft} sq.ft</span>
            </div>
            <input
              type="range"
              min="800"
              max="10000"
              step="100"
              value={builtUpSqft}
              onChange={(e) => setBuiltUpSqft(e.target.value)}
              className="w-full accent-coral cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
              <span>800 sqft (Penthouse)</span>
              <span>5,000 sqft (Villa)</span>
              <span>10,000 sqft (Palacio)</span>
            </div>
          </div>

          {/* Property Type & Bedrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Asset Class</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs font-semibold text-prussian focus:outline-none focus:border-coral bg-white"
              >
                <option value="villa">Luxury Pool Villa</option>
                <option value="heritage">Portuguese Estate</option>
                <option value="penthouse">Penthouse</option>
                <option value="land">Residential Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs font-semibold text-prussian focus:outline-none focus:border-coral bg-white"
              >
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK Grand</option>
              </select>
            </div>
          </div>

          {/* Luxury Multipliers */}
          <div className="pt-2 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-xl bg-alabaster-50 border border-alabaster hover:border-coral transition-colors">
              <input
                type="checkbox"
                checked={hasPrivatePool}
                onChange={(e) => setHasPrivatePool(e.target.checked)}
                className="accent-coral w-4 h-4 rounded"
              />
              <span className="text-xs font-semibold text-prussian">
                Private Swimming Pool (+₹1,200/sqft premium)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-xl bg-alabaster-50 border border-alabaster hover:border-coral transition-colors">
              <input
                type="checkbox"
                checked={isHeritage}
                onChange={(e) => setIsHeritage(e.target.checked)}
                className="accent-coral w-4 h-4 rounded"
              />
              <span className="text-xs font-semibold text-prussian">
                Authentic Indo-Portuguese Heritage Balcão (1.28x multiplier)
              </span>
            </label>
          </div>

          {/* Compute Button */}
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#102542] hover:bg-[#1b2d4e] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-coral" />
            <span>{loading ? 'Evaluating Micro-Market...' : 'Recalculate AVM Comps'}</span>
          </button>

        </div>

        {/* Results & Multi-Portal Breakdown Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Valuation Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#102542] to-[#1b2d4e] text-white shadow-luxury border border-coral/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-coral">
                Kshetram Fair Market Valuation
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                94% Confidence Index
              </span>
            </div>

            <div className="my-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                  {formatCr(valuationResult.estimatedValuation)}
                </div>
                <p className="text-xs text-alabaster-300 mt-0.5">
                  Avg Rate: <strong className="text-white">₹{valuationResult.pricePerSqft?.toLocaleString('en-IN')}/sq.ft</strong> built-up
                </p>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-alabaster-400">Estimated Range:</div>
                <div className="text-xs font-mono font-bold text-coral">
                  {formatCr(valuationResult.lowRange)} - {formatCr(valuationResult.highRange)}
                </div>
              </div>
            </div>

            {/* Micro-market mini stats */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-alabaster-400">Annual Appreciation</div>
                <div className="font-bold text-emerald-400">+{valuationResult.marketTrends?.annualAppreciation}% YoY</div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-alabaster-400">Avg Rental Yield</div>
                <div className="font-bold text-coral">{valuationResult.marketTrends?.rentalYieldAvg}% Net</div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <div className="text-[10px] text-alabaster-400">Demand Level</div>
                <div className="font-bold text-white">{valuationResult.marketTrends?.demandIndex}</div>
              </div>
            </div>
          </div>

          {/* Multi-Portal Comparison Matrix (MagicBricks, 99acres, Housing.com) */}
          <div className="bg-alabaster-50 p-5 rounded-2xl border border-alabaster space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-coral" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-prussian">
                  Multi-Platform Public Listing Benchmark Index
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">Live Portal Aggregation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {valuationResult.crossPlatformComparisons?.map((comp, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-alabaster shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: comp.portalColor }}
                    >
                      {comp.portal}
                    </span>
                    <span className={`text-xs font-bold font-mono ${comp.variancePercent >= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {comp.variancePercent >= 0 ? `+${comp.variancePercent}%` : `${comp.variancePercent}%`}
                    </span>
                  </div>

                  <div className="text-base font-bold text-prussian font-serif">
                    {formatCr(comp.estimatedValue)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Rate: ₹{comp.avgMicroMarketRate?.toLocaleString('en-IN')}/sqft
                  </div>

                  <div className="mt-2 pt-2 border-t border-alabaster-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Sample: {comp.sampleSize} comps</span>
                    <span>Conf: {comp.confidenceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Comparable Sales in Micro-Market */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Recent Registered Sales Benchmarks ({microMarket})
            </h4>
            <div className="space-y-2">
              {valuationResult.recentComparableSales?.map((sale, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-alabaster flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-prussian">{sale.name}</div>
                    <div className="text-[11px] text-gray-500">{sale.areaSqft} sqft • {sale.titleStatus}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-coral font-serif">{formatCr(sale.soldPrice)}</div>
                    <div className="text-[10px] text-gray-400">{sale.transactionDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


import React, { useState } from 'react';
import { useProperty } from '../context/PropertyContext';
import { FORMAT_CURRENCY } from '../lib/sampleData';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Percent, 
  Building2, 
  Plane, 
  Hospital, 
  Car, 
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Scale
} from 'lucide-react';

const MICRO_MARKET_ANALYTICS = [
  {
    market: 'Assagao',
    category: 'Ultra-Luxury Heritage & Gastronomy Hub',
    avgPriceSqft: 26500,
    netYield: 6.9,
    peakOccupancy: 88,
    monsoonOccupancy: 68,
    fiveYearCAGR: 16.5,
    catalyst: 'High concentration of Michelin-grade culinary venues and fashion ateliers.',
    liquidity: 'Very High',
    primaryBuyer: 'Tech Founders, HNIs, Family Offices'
  },
  {
    market: 'Anjuna',
    category: 'Coastal Hospitality & Boutique Nightlife',
    avgPriceSqft: 23200,
    netYield: 7.4,
    peakOccupancy: 91,
    monsoonOccupancy: 64,
    fiveYearCAGR: 15.2,
    catalyst: 'Direct beach connectivity and high daily ADR short-term luxury rentals.',
    liquidity: 'High',
    primaryBuyer: 'Hospitality Operators, Private Equity'
  },
  {
    market: 'Siolim',
    category: 'Chapora Riverfront & Luxury Waterfront Corridors',
    avgPriceSqft: 17800,
    netYield: 6.5,
    peakOccupancy: 82,
    monsoonOccupancy: 70,
    fiveYearCAGR: 19.4,
    catalyst: 'Expanding riverside marina developments and new access bridge.',
    liquidity: 'High Growth',
    primaryBuyer: 'Generational Wealth, Creative HNIs'
  },
  {
    market: 'Morjim',
    category: 'Mopa International Airport Corridor & Beachside',
    avgPriceSqft: 20500,
    netYield: 7.1,
    peakOccupancy: 86,
    monsoonOccupancy: 60,
    fiveYearCAGR: 21.0,
    catalyst: '18-minute drive to Mopa GOX Airport via direct 4-lane expressway.',
    liquidity: 'Rapid Accelerating',
    primaryBuyer: 'Strategic Land Investors, Resort Developers'
  },
  {
    market: 'Aldona',
    category: 'Ancestral Portuguese Quintas & Serene Backwaters',
    avgPriceSqft: 13500,
    netYield: 5.5,
    peakOccupancy: 72,
    monsoonOccupancy: 66,
    fiveYearCAGR: 13.5,
    catalyst: 'Strict zoning preservation preventing commercial overcrowding.',
    liquidity: 'Moderate (Heritage Niche)',
    primaryBuyer: 'Retirement HNIs, Heritage Preservationists'
  }
];

export default function InvestorPortalPage({ setActiveTab }) {
  const { properties, setSelectedPropertyForModal, toggleComparison, isMarked } = useProperty();

  // Dynamic LTV Simulator
  const [ltvPercent, setLtvPercent] = useState(60);
  const [interestRate, setInterestRate] = useState(8.5);

  const calculateDynamicCashOnCash = (price, netYield, ltv, interest) => {
    const loanAmount = price * (ltv / 100);
    const equityDown = price * ((100 - ltv) / 100);
    const annualRent = price * (netYield / 100);
    const annualInterestCost = loanAmount * (interest / 100);
    const netCashFlow = annualRent - annualInterestCost;
    if (equityDown <= 0) return 0;
    const coc = (netCashFlow / equityDown) * 100;
    return Math.max(coc, 0).toFixed(1);
  };

  return (
    <div className="bg-alabaster-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Institutional Hero Banner */}
        <div className="bg-[#102542] rounded-3xl p-8 sm:p-12 text-white shadow-luxury relative overflow-hidden border border-coral/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-coral text-xs font-bold uppercase tracking-wider border border-coral/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Institutional & HNI Wealth Builders</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Predictive Yields & Micro-Market Portfolio Analytics
            </h1>

            <p className="text-alabaster text-sm sm:text-base leading-relaxed font-light">
              Evaluate Net Rental Yields, Seasonal Occupancy Spreads, 60% LTV Cash-on-Cash Return Matrices, and Mopa Airport Infrastructure Proximities across Goa's highest-performing corridors.
            </p>
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* 1. Predictive Yield Analytics Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-alabaster gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  Predictive Yield Analytics & CAGR Forecasting
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Net rental yields, high vs monsoon season occupancy rates, and multi-year CAGR forecasting across Goa micro-markets.
              </p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Assagao & Morjim Leading Alpha
            </span>
          </div>

          {/* Cards Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-alabaster text-xs uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Micro-Market Corridor</th>
                  <th className="py-3 px-4">Avg Rate/SqFt</th>
                  <th className="py-3 px-4">Net Yield</th>
                  <th className="py-3 px-4">Seasonal Occupancy (Peak / Low)</th>
                  <th className="py-3 px-4">5-Yr Projected CAGR</th>
                  <th className="py-3 px-4">Liquidity Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-alabaster text-xs">
                {MICRO_MARKET_ANALYTICS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-alabaster-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-serif text-sm font-bold text-prussian">{item.market}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.category}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-prussian">
                      ₹{item.avgPriceSqft.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-coral">
                      {item.netYield}%
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span className="text-emerald-700 font-bold">{item.peakOccupancy}%</span> (Peak) / <span className="text-gray-500">{item.monsoonOccupancy}%</span> (Monsoon)
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                      +{item.fiveYearCAGR}% YoY
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#102542] text-white">
                        {item.liquidity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Portfolio Comparison Matrix with Dynamic LTV Simulator */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-alabaster gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  Portfolio Financial Comparison Matrix
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Side-by-side financial metrics: Cap Rate, Cash-on-Cash Return (60% LTV), and Liquidity Risk.
              </p>
            </div>

            {/* LTV & Rate Slider Pill */}
            <div className="p-3 rounded-xl bg-alabaster-50 border border-alabaster flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-prussian uppercase text-[10px]">LTV:</span>
                <span className="font-mono font-bold text-coral">{ltvPercent}%</span>
                <input
                  type="range"
                  min="40"
                  max="75"
                  step="5"
                  value={ltvPercent}
                  onChange={(e) => setLtvPercent(parseFloat(e.target.value))}
                  className="accent-coral w-20 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-bold text-prussian uppercase text-[10px]">Mortgage Rate:</span>
                <span className="font-mono font-bold text-prussian">{interestRate}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(prop => {
              const dynamicCoc = calculateDynamicCashOnCash(prop.price, prop.net_rental_yield, ltvPercent, interestRate);
              const marked = isMarked(prop.id);

              return (
                <div
                  key={prop.id}
                  className="p-5 rounded-2xl border border-alabaster hover:border-coral bg-white shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-coral">
                        {prop.micro_market}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prop.liquidity_risk === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prop.liquidity_risk} Liquidity Risk
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-prussian line-clamp-1">{prop.title}</h4>
                    <p className="font-serif text-lg font-bold text-coral mt-1">
                      {FORMAT_CURRENCY(prop.price)}
                    </p>
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-alabaster-50 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Cap Rate</div>
                      <div className="font-bold text-emerald-700 font-mono mt-0.5">{prop.cap_rate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">{ltvPercent}% LTV CoC</div>
                      <div className="font-bold text-coral font-mono mt-0.5">{dynamicCoc}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">5-Yr CAGR</div>
                      <div className="font-bold text-prussian font-mono mt-0.5">+{prop.projected_5yr_cagr}%</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => setSelectedPropertyForModal(prop)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#102542] hover:bg-coral text-white font-bold text-xs uppercase transition-colors text-center"
                    >
                      Audit Details
                    </button>

                    <button
                      onClick={() => toggleComparison(prop.id)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        marked ? 'bg-coral text-white border-coral' : 'border-alabaster text-gray-600 hover:border-coral'
                      }`}
                      title="Compare"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Infrastructure Catalysts Proximity Tracker */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-alabaster gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  Infrastructure Catalysts & Airport Connectivity
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Tracking exact travel distance and drive times to Manohar International Airport (Mopa), Dabolim, Manipal Tertiary Hospital, and NH66 Corridors.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-coral bg-coral-50 px-3 py-1 rounded-full border border-coral-200">
              <Plane className="w-3.5 h-3.5" />
              <span>Mopa Expressway Multiplier</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map(prop => (
              <div key={prop.id} className="p-5 rounded-2xl bg-alabaster-50 border border-alabaster space-y-4">
                <div>
                  <h4 className="font-serif text-sm font-bold text-prussian">{prop.title}</h4>
                  <p className="text-xs text-gray-500">{prop.micro_market}, Goa</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-alabaster">
                    <span className="flex items-center space-x-1.5 text-gray-600">
                      <Plane className="w-3.5 h-3.5 text-coral" />
                      <span>Manohar Airport (Mopa GOX)</span>
                    </span>
                    <strong className="text-prussian">{prop.mopa_airport_dist_km} km ({Math.round(prop.mopa_airport_dist_km * 1.5)} mins)</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-alabaster">
                    <span className="flex items-center space-x-1.5 text-gray-600">
                      <Plane className="w-3.5 h-3.5 text-gray-400" />
                      <span>Dabolim Airport (GOI)</span>
                    </span>
                    <strong className="text-gray-700">{prop.dabolim_airport_dist_km} km ({Math.round(prop.dabolim_airport_dist_km * 1.8)} mins)</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-alabaster">
                    <span className="flex items-center space-x-1.5 text-gray-600">
                      <Hospital className="w-3.5 h-3.5 text-red-500" />
                      <span>Manipal Tertiary Hospital</span>
                    </span>
                    <strong className="text-prussian">{prop.hospital_dist_km} km ({Math.round(prop.hospital_dist_km * 2.5)} mins)</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-alabaster">
                    <span className="flex items-center space-x-1.5 text-gray-600">
                      <Car className="w-3.5 h-3.5 text-blue-500" />
                      <span>NH66 6-Lane Expressway</span>
                    </span>
                    <strong className="text-emerald-700 font-bold">{prop.highway_dist_km} km</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}


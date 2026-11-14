import React from 'react';
import { useProperty } from '../context/PropertyContext';
import { 
  Scale, 
  Trash2, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { FORMAT_CURRENCY } from '../lib/sampleData';

export default function ComparisonMatrix({ onSelectProperty, onExploreMore }) {
  const { 
    comparedProperties, 
    toggleComparison, 
    clearComparison, 
    properties,
    setSelectedPropertyForModal 
  } = useProperty();

  if (comparedProperties.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-alabaster text-center shadow-luxury">
        <div className="w-14 h-14 rounded-2xl bg-alabaster-100 text-coral flex items-center justify-center mx-auto mb-3">
          <Scale className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-prussian">
          Property Comparison Matrix
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
          No properties currently marked for comparison. Browse listings in Explore or select from the pre-audited estates below.
        </p>
        <button
          onClick={() => {
            if (properties.length >= 2) {
              toggleComparison(properties[0].id);
              toggleComparison(properties[1].id);
            }
          }}
          className="px-6 py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all"
        >
          Compare Top 2 Curated Goa Estates
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-alabaster shadow-luxury">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-alabaster gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
              05
            </span>
            <h3 className="font-serif text-2xl font-bold text-prussian">
              Multi-Asset Comparison Matrix
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Side-by-side financial, cadastral, and spatial analysis of properties marked for comparison.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={clearComparison}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-alabaster">
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-gray-400 w-1/4">
                Metric / Attribute
              </th>
              {comparedProperties.map(prop => (
                <th key={prop.id} className="p-3 w-1/4 align-top">
                  <div className="relative group">
                    <img 
                      src={prop.featured_image || prop.photos?.[0]} 
                      alt={prop.title}
                      className="w-full h-32 object-cover rounded-xl border border-alabaster mb-2" 
                    />
                    <button
                      onClick={() => toggleComparison(prop.id)}
                      className="absolute top-2 right-2 bg-[#102542]/80 hover:bg-red-600 text-white p-1 rounded-md text-[10px] transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                    <h4 className="font-serif text-sm font-bold text-prussian line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-gray-500">{prop.micro_market}, Goa</p>
                    <p className="font-serif text-base font-bold text-coral mt-1">
                      {FORMAT_CURRENCY(prop.price)}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-alabaster text-xs">
            
            {/* Price & Area */}
            <tr className="bg-alabaster-50/50">
              <td className="p-3 font-bold text-prussian">Price per Sq. Ft</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-mono font-bold text-prussian">
                  ₹{prop.price_per_sqft?.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Built-Up Area</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-medium">
                  {prop.built_up_sqft} sq.ft
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Plot Area</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-medium">
                  {prop.plot_sqft} sq.ft ({Math.round(prop.plot_sqft / 10.7639)} m²)
                </td>
              ))}
            </tr>

            {/* Title & Cadastral Status */}
            <tr className="bg-alabaster-50/50">
              <td className="p-3 font-bold text-prussian">Form I & XIV Title Status</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    prop.title_status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-coral-50 text-coral-700 border border-coral-200'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{prop.title_status}</span>
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Cadastral Survey No.</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-mono text-gray-700">
                  {prop.village} {prop.survey_no}/{prop.subdivision_no}
                </td>
              ))}
            </tr>

            {/* Investor Returns */}
            <tr className="bg-alabaster-50/50">
              <td className="p-3 font-bold text-prussian">Cap Rate</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-mono font-bold text-emerald-700">
                  {prop.cap_rate}%
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Cash-on-Cash (60% LTV)</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-mono font-bold text-coral">
                  {prop.cash_on_cash_return}%
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Projected 5-Yr CAGR</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 font-mono font-bold text-prussian">
                  +{prop.projected_5yr_cagr}% YoY
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Liquidity Risk</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    prop.liquidity_risk === 'Low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {prop.liquidity_risk} Risk
                  </span>
                </td>
              ))}
            </tr>

            {/* Infrastructure Proximities */}
            <tr className="bg-alabaster-50/50">
              <td className="p-3 font-bold text-prussian">Mopa Airport (GOX)</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 text-gray-700">
                  {prop.mopa_airport_dist_km} km ({Math.round(prop.mopa_airport_dist_km * 1.5)} mins)
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 font-semibold text-gray-700">Nearest Coast / Beach</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3 text-gray-700">
                  {prop.beach_dist_km} km
                </td>
              ))}
            </tr>

            {/* Action */}
            <tr>
              <td className="p-3 font-bold text-prussian">Actions</td>
              {comparedProperties.map(prop => (
                <td key={prop.id} className="p-3">
                  <button
                    onClick={() => setSelectedPropertyForModal(prop)}
                    className="w-full py-2 px-3 rounded-lg bg-[#102542] hover:bg-coral text-white font-bold text-xs uppercase transition-colors"
                  >
                    View Details & Offer
                  </button>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}


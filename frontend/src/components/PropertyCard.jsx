import React, { useState, useEffect } from 'react';
import { useProperty } from '../context/PropertyContext';
import { FORMAT_CURRENCY } from '../lib/sampleData';
import { fetchLiveAQI } from '../lib/aqiService';
import { 
  ShieldCheck, 
  Scale, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  TrendingUp,
  Check,
  Zap,
  Droplets,
  Wind
} from 'lucide-react';

export default function PropertyCard({ property }) {
  const { isMarked, toggleComparison, setSelectedPropertyForModal } = useProperty();
  const marked = isMarked(property.id);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const lat = property.latitude || 15.5907;
    const lng = property.longitude || 73.7842;
    fetchLiveAQI(lat, lng)
      .then((data) => {
        if (isMounted) setAqi(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [property.latitude, property.longitude]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-alabaster shadow-prussian-card hover:shadow-luxury hover:border-coral transition-all duration-300 flex flex-col group">
      
      {/* Image & Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        <img
          src={property.featured_image || property.photos?.[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Title Status Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center space-x-1 ${
            property.title_status === 'Verified'
              ? 'bg-emerald-900/85 text-emerald-300 backdrop-blur-md border border-emerald-500/30'
              : 'bg-[#102542]/85 text-coral backdrop-blur-md border border-coral/30'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{property.title_status}</span>
          </span>
        </div>

        {/* Mark for Comparison Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleComparison(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md text-xs font-bold transition-all shadow-md flex items-center space-x-1 ${
            marked
              ? 'bg-coral text-white shadow-coral-glow'
              : 'bg-[#102542]/80 text-alabaster hover:text-white hover:bg-[#102542]'
          }`}
          title={marked ? 'Remove from Comparison' : 'Mark for Comparison'}
        >
          <Scale className="w-4 h-4" />
          <span className="text-[10px] hidden sm:inline">{marked ? 'Marked' : 'Compare'}</span>
        </button>

        {/* Price Tag Overlap */}
        <div className="absolute bottom-3 left-3 bg-[#102542]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white">
          <span className="font-serif font-bold text-lg text-coral">
            {FORMAT_CURRENCY(property.price)}
          </span>
        </div>

        {/* Micro-market Tag */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-prussian flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-coral" />
          <span>{property.micro_market}</span>
        </div>
      </div>

      {/* Body Content */}
      <div 
        onClick={() => setSelectedPropertyForModal(property)}
        className="p-5 flex-1 flex flex-col justify-between cursor-pointer space-y-4"
      >
        <div>
          <h3 className="font-serif text-lg font-bold text-prussian line-clamp-1 group-hover:text-coral transition-colors">
            {property.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Essential Utilities Badges: Electricity, Water & AQI */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span 
            title={`Electricity: ${property.electricity_status || '3-Phase Connected'}`}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-semibold"
          >
            <Zap className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />
            <span className="truncate">{property.electricity_status?.split('(')[0] || '3-Phase Power'}</span>
          </span>

          <span 
            title={`Water: ${property.water_status || 'PWD Supply + Borewell'}`}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200/80 text-[10px] font-semibold"
          >
            <Droplets className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />
            <span className="truncate">{property.water_status?.split('+')[0]?.trim() || 'PWD Water'}</span>
          </span>

          <span 
            title={`Open-Meteo Air Quality: AQI ${aqi ? aqi.usAqi : '28'} (${aqi?.status?.category || 'Pristine Coastal Air'})`}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-semibold"
          >
            <Wind className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />
            <span>AQI {aqi ? aqi.usAqi : '~28'} • {aqi ? aqi.status?.level : 'Pristine'}</span>
          </span>
        </div>

        {/* Dimensions Specs */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-alabaster text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Bed className="w-3.5 h-3.5 text-khaki flex-shrink-0" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-3.5 h-3.5 text-khaki flex-shrink-0" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Maximize2 className="w-3.5 h-3.5 text-khaki flex-shrink-0" />
            <span>{property.built_up_sqft} sqft</span>
          </div>
        </div>

        {/* Investor Highlights Bar */}
        <div className="bg-alabaster-50 p-3 rounded-xl border border-alabaster flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Cash-on-Cash (60% LTV)</div>
            <div className="font-bold text-coral font-mono">{property.cash_on_cash_return}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Cap Rate</div>
            <div className="font-bold text-emerald-700 font-mono">{property.cap_rate}%</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Liquidity</div>
            <div className={`font-bold uppercase text-[10px] ${
              property.liquidity_risk === 'Low' ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {property.liquidity_risk}
            </div>
          </div>
        </div>

        {/* Seller Info / Click to View */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-6 h-6 rounded-full bg-alabaster text-prussian flex items-center justify-center font-bold text-[10px]">
              {property.seller_name?.[0] || 'S'}
            </div>
            <span className="truncate">{property.seller_name}</span>
          </div>
          <span className="font-semibold text-coral group-hover:underline">View Details →</span>
        </div>

      </div>

    </div>
  );
}


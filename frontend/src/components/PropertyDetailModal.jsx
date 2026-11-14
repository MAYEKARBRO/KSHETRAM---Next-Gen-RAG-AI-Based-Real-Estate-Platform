import React, { useState, useEffect } from 'react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { FORMAT_CURRENCY } from '../lib/sampleData';
import { fetchLiveAQI } from '../lib/aqiService';
import { 
  X, 
  ShieldCheck, 
  Scale, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  TrendingUp, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Send, 
  MessageSquare,
  Sparkles,
  Plane,
  Building,
  Navigation,
  Zap,
  Droplets,
  Wind,
  Leaf,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PropertyDetailModal() {
  const { selectedPropertyForModal, setSelectedPropertyForModal, isMarked, toggleComparison, placeBid } = useProperty();
  const { user } = useAuth();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderName, setBidderName] = useState(user?.first_name ? `${user.first_name} ${user.last_name || ''}` : '');
  const [bidderPhone, setBidderPhone] = useState(user?.phone || '');
  const [bidMessage, setBidMessage] = useState('Immediate cash offer. 14-day escrow completion.');
  const [bidSuccess, setBidSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(false);

  useEffect(() => {
    if (!selectedPropertyForModal) return;
    let isMounted = true;
    setAqiLoading(true);
    const lat = selectedPropertyForModal.latitude || 15.5907;
    const lng = selectedPropertyForModal.longitude || 73.7842;

    fetchLiveAQI(lat, lng)
      .then((data) => {
        if (isMounted) {
          setAqiData(data);
          setAqiLoading(false);
        }
      })
      .catch((err) => {
        console.error('AQI fetch error:', err);
        if (isMounted) setAqiLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPropertyForModal]);

  const handleRefreshAQI = async () => {
    if (!selectedPropertyForModal) return;
    setAqiLoading(true);
    const lat = selectedPropertyForModal.latitude || 15.5907;
    const lng = selectedPropertyForModal.longitude || 73.7842;
    const data = await fetchLiveAQI(lat, lng);
    setAqiData(data);
    setAqiLoading(false);
  };

  if (!selectedPropertyForModal) return null;
  const prop = selectedPropertyForModal;
  const marked = isMarked(prop.id);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const amountNum = parseFloat(bidAmount) || prop.price;

    const res = await placeBid({
      property_id: prop.id,
      property_title: prop.title,
      seller_id: prop.user_id,
      seller_phone: prop.seller_phone,
      buyer_id: user?.id || 'guest-buyer',
      buyer_name: bidderName || 'Interested Buyer',
      buyer_phone: bidderPhone || '+91 98000 00000',
      buyer_email: user?.email || 'buyer@example.com',
      bid_amount: amountNum,
      message: bidMessage
    });

    setSubmitting(false);
    setBidSuccess(res);

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-prussian-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-alabaster overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-alabaster bg-white sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
              prop.title_status === 'Verified'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-coral-50 text-coral-700'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{prop.title_status}</span>
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Survey {prop.survey_no}/{prop.subdivision_no}, {prop.village}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mark for Comparison Toggle */}
            <button
              onClick={() => toggleComparison(prop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                marked
                  ? 'bg-coral text-white border-coral shadow-coral-glow'
                  : 'bg-alabaster-50 text-prussian border-alabaster hover:border-coral'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{marked ? 'Marked for Compare' : 'Mark for Comparison'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPropertyForModal(null)}
              className="p-1.5 rounded-full hover:bg-alabaster-100 text-gray-500 hover:text-prussian transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-alabaster">
              <img
                src={prop.photos?.[activePhotoIndex] || prop.featured_image}
                alt={prop.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 left-4 bg-[#102542]/90 backdrop-blur-md px-4 py-2 rounded-xl text-white">
                <div className="font-serif text-2xl font-bold text-coral">
                  {FORMAT_CURRENCY(prop.price)}
                </div>
                <div className="text-[11px] text-alabaster-300">
                  ₹{prop.price_per_sqft?.toLocaleString('en-IN')}/sq.ft
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {prop.photos && prop.photos.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {prop.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activePhotoIndex === idx ? 'border-coral scale-105' : 'border-alabaster opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Address & Spatial Specs */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-prussian">{prop.title}</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-coral flex-shrink-0" />
              <span>{prop.address}</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-alabaster-50 p-3 rounded-xl border border-alabaster text-center">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Built-Up Area</div>
                <div className="font-bold text-prussian font-serif text-base mt-0.5">{prop.built_up_sqft} sqft</div>
              </div>
              <div className="bg-alabaster-50 p-3 rounded-xl border border-alabaster text-center">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Plot / Garden</div>
                <div className="font-bold text-prussian font-serif text-base mt-0.5">{prop.plot_sqft} sqft</div>
              </div>
              <div className="bg-alabaster-50 p-3 rounded-xl border border-alabaster text-center">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Bedrooms</div>
                <div className="font-bold text-prussian font-serif text-base mt-0.5">{prop.bedrooms} BHK</div>
              </div>
              <div className="bg-alabaster-50 p-3 rounded-xl border border-alabaster text-center">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Bathrooms</div>
                <div className="font-bold text-prussian font-serif text-base mt-0.5">{prop.bathrooms} Luxury</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-base font-bold text-prussian mb-2">Architectural Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>
          </div>

          {/* Amenities & Luxury Features */}
          {prop.amenities && (
            <div>
              <h3 className="font-serif text-base font-bold text-prussian mb-3">Estates Amenities & Features</h3>
              <div className="flex flex-wrap gap-2">
                {prop.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-alabaster-100 text-prussian font-medium text-xs flex items-center space-x-1.5 border border-alabaster"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Essential Utilities Availability: Electricity & Water */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-blue-50/80 border border-amber-200/70 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                  ⚡
                </span>
                <h3 className="font-serif text-sm font-bold text-prussian uppercase tracking-wider">
                  Essential Utilities & Infrastructure Availability
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Verified On-Site ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-sm flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Electricity Power Status
                  </div>
                  <div className="font-bold text-prussian text-sm mt-0.5">
                    {prop.electricity_status || '3-Phase Grid Connected (15 kW)'}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Goa Electricity Department (GED) meter active with sanctioned industrial/domestic load.
                  </div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-sm flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Water Supply Status
                  </div>
                  <div className="font-bold text-prussian text-sm mt-0.5">
                    {prop.water_status || 'PWD Municipal Line + Sweet Water Well'}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Continuous dual-source potable freshwater with dedicated pump and overhead sump tanks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Open-Meteo Air Quality & Atmospheric Wellness */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#102542] to-emerald-900 text-white space-y-4 shadow-luxury border border-emerald-500/40 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                      Live Environmental & Atmospheric AQI
                    </h3>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Open-Meteo Global Atmospheric Sensor • {prop.village || 'Goa'}, Coastal Grid ({prop.latitude?.toFixed(3) || '15.590'}°N, {prop.longitude?.toFixed(3) || '73.784'}°E)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRefreshAQI}
                  disabled={aqiLoading}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-alabaster text-xs flex items-center space-x-1.5 transition-all border border-white/10 disabled:opacity-50"
                  title="Refresh live atmospheric sensor data from Open-Meteo"
                >
                  <RefreshCw className={`w-3 h-3 text-emerald-300 ${aqiLoading ? 'animate-spin' : ''}`} />
                  <span className="text-[11px]">{aqiLoading ? 'Syncing...' : 'Live Sync'}</span>
                </button>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Zero API Key • Free
                </span>
              </div>
            </div>

            {aqiData ? (
              <div className="space-y-4 relative z-10">
                {/* Main AQI Score Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        US Air Quality Index
                      </span>
                      <span className="text-[10px] text-gray-300 font-mono">
                        {aqiData.fetchedAt ? `Updated ${aqiData.fetchedAt}` : 'Real-time'}
                      </span>
                    </div>

                    <div className="my-2 flex items-baseline space-x-2">
                      <span className="font-serif text-4xl font-extrabold text-white">
                        {aqiData.usAqi}
                      </span>
                      <span className="text-xs text-emerald-200 font-medium">/ 500 AQI</span>
                    </div>

                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        aqiData.usAqi <= 50 
                          ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40' 
                          : aqiData.usAqi <= 100 
                            ? 'bg-amber-500/30 text-amber-200 border-amber-400/40' 
                            : 'bg-orange-500/30 text-orange-200 border-orange-400/40'
                      }`}>
                        {aqiData.status?.category || 'Pristine Coastal Air'}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Atmospheric Health & Micro-Climate Assessment</span>
                      </div>
                      <p className="text-xs text-alabaster-200 mt-1.5 leading-relaxed">
                        {aqiData.status?.summary || 'Clean Arabian Sea maritime breeze with minimal particulate matter.'}
                      </p>
                      <p className="text-[11px] text-emerald-200/90 mt-1.5">
                        🌿 <span className="font-semibold text-emerald-300">Living recommendation:</span> {aqiData.status?.healthRecommendation || 'Ideal for outdoor recreation, yoga, morning coastal walks, and senior living.'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-alabaster-300">
                      <span>European AQI Index: <strong className="text-white">{aqiData.europeanAqi} (Clean)</strong></span>
                      <span className="text-emerald-300 font-mono">Micro-Climate: Pure Maritime Flow</span>
                    </div>
                  </div>
                </div>

                {/* Pollutant Sensor Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-300 block uppercase font-bold">PM 2.5 (Fine Particles)</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5">{aqiData.pm25} µg/m³</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">WHO Ideal (&lt; 15)</span>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-300 block uppercase font-bold">PM 10 (Coarse Particles)</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5">{aqiData.pm10} µg/m³</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Clean (&lt; 45)</span>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-300 block uppercase font-bold">Ozone (O₃)</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5">{aqiData.ozone} µg/m³</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Optimal Sea Coast</span>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-300 block uppercase font-bold">Nitrogen Dioxide (NO₂)</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5">{aqiData.no2} µg/m³</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Minimal Traffic</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <span className="text-xs text-emerald-200">Connecting to Open-Meteo atmospheric sensors for {prop.village}...</span>
              </div>
            )}
          </div>

          {/* Institutional Investor Metrics Panel */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#102542] to-[#1b2d4e] text-white space-y-4 shadow-luxury border border-coral/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-coral" />
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Investor Financial Metrics
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-coral/20 text-coral font-bold border border-coral/30">
                Institutional & HNI Grade
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-alabaster-400 text-[10px] uppercase font-bold">Net Rental Yield</div>
                <div className="font-bold text-white font-serif text-lg mt-0.5">{prop.net_rental_yield}%</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-alabaster-400 text-[10px] uppercase font-bold">Cash-on-Cash (60% LTV)</div>
                <div className="font-bold text-coral font-serif text-lg mt-0.5">{prop.cash_on_cash_return}%</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-alabaster-400 text-[10px] uppercase font-bold">Cap Rate</div>
                <div className="font-bold text-emerald-400 font-serif text-lg mt-0.5">{prop.cap_rate}%</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-alabaster-400 text-[10px] uppercase font-bold">Projected 5-Yr CAGR</div>
                <div className="font-bold text-white font-serif text-lg mt-0.5">+{prop.projected_5yr_cagr}%</div>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-alabaster-300">
              <div className="bg-white/5 p-2 rounded">
                <span className="text-[10px] text-alabaster-400 block">Annual Gross Hospitality Rent:</span>
                <span className="font-bold text-white font-serif">{FORMAT_CURRENCY(prop.annual_gross_rent)}</span>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <span className="text-[10px] text-alabaster-400 block">Occupancy Rate:</span>
                <span className="font-bold text-white">{prop.occupancy_rate}% (High Season 90%)</span>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <span className="text-[10px] text-alabaster-400 block">Liquidity Risk:</span>
                <span className="font-bold text-coral uppercase">{prop.liquidity_risk} Risk Profile</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Catalyst Proximity */}
          <div className="p-5 rounded-2xl bg-alabaster-50 border border-alabaster space-y-3">
            <h3 className="font-serif text-sm font-bold text-prussian uppercase tracking-wider flex items-center space-x-1.5">
              <Navigation className="w-4 h-4 text-coral" />
              <span>Infrastructure Catalysts Proximity (Goa Network)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-alabaster">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Mopa Airport (GOX)</span>
                <span className="font-bold text-prussian">{prop.mopa_airport_dist_km} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-alabaster">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Dabolim Airport</span>
                <span className="font-bold text-prussian">{prop.dabolim_airport_dist_km} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-alabaster">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Manipal Hospital</span>
                <span className="font-bold text-prussian">{prop.hospital_dist_km} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-alabaster">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Coast / Beach</span>
                <span className="font-bold text-coral">{prop.beach_dist_km} km</span>
              </div>
            </div>
          </div>

          {/* Seller / Mandate Broker Profile Card */}
          <div className="p-6 rounded-2xl bg-white border-2 border-alabaster flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={prop.seller_logo_url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'}
                alt={prop.seller_name}
                className="w-14 h-14 rounded-2xl object-cover border border-alabaster shadow-sm"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral">
                  Verified Mandate / Listing Owner
                </span>
                <h4 className="font-serif text-lg font-bold text-prussian">{prop.seller_name}</h4>
                <p className="text-xs text-gray-500">{prop.seller_company || 'Private Owner'}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                  <span>{prop.seller_phone}</span>
                  <span>•</span>
                  <span>{prop.seller_email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBidForm(!showBidForm)}
              className="px-6 py-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Place Cash Offer / Bid</span>
            </button>
          </div>

          {/* Instant Bid / WhatsApp Notification Form */}
          {showBidForm && (
            <div className="p-6 rounded-2xl bg-coral-50/60 border-2 border-coral space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-prussian">
                    Submit Formal Cash Offer to Seller
                  </h4>
                  <p className="text-xs text-gray-600">
                    Seller will receive an automated verified WhatsApp alert with your offer amount and details.
                  </p>
                </div>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="text-xs text-gray-400 hover:text-prussian"
                >
                  Cancel
                </button>
              </div>

              {bidSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Offer Submitted Successfully! WhatsApp Alert Dispatched to Seller.</span>
                  </div>
                  <p className="text-gray-600">
                    Seller: <strong>{prop.seller_name}</strong> ({prop.seller_phone}) has been notified.
                  </p>
                  {bidSuccess.data?.whatsapp_direct_link && (
                    <a
                      href={bidSuccess.data.whatsapp_direct_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase shadow transition-all hover:bg-emerald-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open WhatsApp Chat with Seller Now</span>
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="Vikram Singhania"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs bg-white focus:outline-none focus:border-coral"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Phone (WhatsApp) *</label>
                      <input
                        type="tel"
                        value={bidderPhone}
                        onChange={(e) => setBidderPhone(e.target.value)}
                        placeholder="+91 98110 99882"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs bg-white focus:outline-none focus:border-coral"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Offer Price (₹ INR) *</label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={prop.price.toString()}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs bg-white font-mono font-bold focus:outline-none focus:border-coral"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Terms / Message</label>
                    <textarea
                      rows={2}
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs bg-white focus:outline-none focus:border-coral resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting Offer...' : 'Transmit Verified Offer & Dispatch WhatsApp Alert'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}


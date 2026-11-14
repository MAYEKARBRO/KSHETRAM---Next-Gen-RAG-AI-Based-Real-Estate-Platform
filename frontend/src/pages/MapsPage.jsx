import React, { useState, useRef } from 'react';
import { useProperty } from '../context/PropertyContext';
import { FORMAT_CURRENCY } from '../lib/sampleData';
import { 
  Search, 
  MapPin, 
  Scale, 
  ExternalLink, 
  ShieldCheck, 
  Bed, 
  Maximize2, 
  Compass, 
  Layers,
  Sparkles
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom house icon for property markers
const createHouseIcon = (isMarked, isSelected) => {
  const bg = isSelected ? '#102542' : (isMarked ? '#F87060' : '#102542');
  const border = isSelected ? '#F87060' : '#FFFFFF';
  return new L.DivIcon({
    className: 'custom-house-pin',
    html: `<div style="background-color: ${bg}; width: 36px; height: 36px; border-radius: 50%; border: 3px solid ${border}; box-shadow: 0 4px 15px rgba(16,37,66,0.35); display: flex; align-items: center; justify-content: center; font-size: 16px; transition: transform 0.2s;">🏠</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Sub-component to center map when selected property changes
function FlyToLocation({ targetCenter }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCenter) {
      map.flyTo([targetCenter.lat, targetCenter.lng], 15, { duration: 1.2 });
    }
  }, [targetCenter, map]);
  return null;
}

export default function MapsPage({ setActiveTab }) {
  const { 
    properties, 
    markedForComparison, 
    toggleComparison, 
    isMarked, 
    setSelectedPropertyForModal 
  } = useProperty();

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleKeyActive = Boolean(googleMapsApiKey && googleMapsApiKey !== 'YOUR_API_KEY_HERE');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMicroMarket, setSelectedMicroMarket] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState(properties[0] || null);
  const [mapCenter, setMapCenter] = useState({ lat: 15.5907, lng: 73.7842 }); // Assagao default
  const [mapLayer, setMapLayer] = useState(isGoogleKeyActive ? 'google-hybrid' : 'satellite'); // 'google-hybrid', 'google-roadmap', 'satellite', 'streets'

  const microMarkets = ['All', 'Assagao', 'Anjuna', 'Vagator', 'Siolim', 'Aldona', 'Morjim'];

  // Filter properties for the sidebar
  const displayedProperties = properties.filter(prop => {
    if (selectedMicroMarket !== 'All' && prop.micro_market.toLowerCase() !== selectedMicroMarket.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = `${prop.title} ${prop.micro_market} ${prop.address} ${prop.village}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const handleSelectProperty = (prop) => {
    setSelectedProperty(prop);
    setMapCenter({ lat: prop.latitude, lng: prop.longitude });
  };

  return (
    <div className="bg-alabaster-50 min-h-[calc(100vh-80px)] flex flex-col">
      
      {/* Top Controls Bar */}
      <div className="bg-white px-4 sm:px-6 py-3 border-b border-alabaster shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-prussian">
              Cadastral & Spatial Map Explorer
            </h2>
            <p className="text-xs text-gray-500">
              Locate marked estates on high-definition Goa cadastral maps
            </p>
          </div>
        </div>

        {/* Satellite / Streets / Google Maps Layer Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg bg-alabaster-100 p-0.5 border border-alabaster text-xs font-semibold overflow-x-auto">
            {isGoogleKeyActive ? (
              <>
                <button
                  onClick={() => setMapLayer('google-hybrid')}
                  className={`px-3 py-1 rounded-md transition-all whitespace-nowrap flex items-center space-x-1 ${
                    mapLayer === 'google-hybrid' ? 'bg-[#102542] text-white shadow' : 'text-gray-600 hover:text-coral'
                  }`}
                  title="Google Maps Satellite with street names & landmark labels"
                >
                  <span>Google Hybrid</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>
                <button
                  onClick={() => setMapLayer('google-roadmap')}
                  className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                    mapLayer === 'google-roadmap' ? 'bg-[#102542] text-white shadow' : 'text-gray-600 hover:text-coral'
                  }`}
                  title="Standard Google Street Maps"
                >
                  Google Roads
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                    mapLayer === 'satellite' ? 'bg-[#102542] text-white shadow' : 'text-gray-600'
                  }`}
                  title="Esri World Satellite Imagery"
                >
                  Esri Satellite
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    mapLayer === 'satellite' ? 'bg-[#102542] text-white shadow' : 'text-gray-600'
                  }`}
                >
                  Satellite Layer
                </button>
                <button
                  onClick={() => setMapLayer('streets')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    mapLayer === 'streets' ? 'bg-[#102542] text-white shadow' : 'text-gray-600'
                  }`}
                >
                  Carto Streets
                </button>
              </>
            )}
          </div>

          {markedForComparison.length > 0 && (
            <button
              onClick={() => setActiveTab('home')}
              className="px-3 py-1.5 rounded-lg bg-coral hover:bg-coral-600 text-white font-bold text-xs shadow-coral-glow transition-all flex items-center space-x-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({markedForComparison.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Left Sidebar + Right Map */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[400px] bg-white border-r border-alabaster flex flex-col h-[420px] lg:h-[calc(100vh-80px)] flex-shrink-0 z-10 shadow-prussian-card">
          
          {/* Sidebar Search Bar */}
          <div className="p-4 border-b border-alabaster space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search micro-market or estate..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/50"
              />
            </div>

            {/* Quick Micro-Market Chips */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
              {microMarkets.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMicroMarket(m)}
                  className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedMicroMarket === m
                      ? 'bg-[#102542] text-white shadow-sm'
                      : 'bg-alabaster-100 text-gray-600 hover:bg-alabaster-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {displayedProperties.length} Estates Found on Map
            </div>

            {displayedProperties.map(prop => {
              const isSelected = selectedProperty?.id === prop.id;
              const marked = isMarked(prop.id);

              return (
                <div
                  key={prop.id}
                  onClick={() => handleSelectProperty(prop)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex space-x-3 ${
                    isSelected
                      ? 'bg-alabaster-100 border-coral shadow-sm ring-1 ring-coral/40'
                      : 'bg-white border-alabaster hover:border-coral/50'
                  }`}
                >
                  <img
                    src={prop.featured_image || prop.photos?.[0]}
                    alt={prop.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-alabaster"
                  />

                  <div className="flex-1 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-coral">
                          {prop.micro_market}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {prop.bedrooms}BHK • {prop.built_up_sqft} sqft
                        </span>
                      </div>

                      <h4 className="font-serif text-xs font-bold text-prussian truncate mt-0.5">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        Survey {prop.survey_no}/{prop.subdivision_no}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif font-bold text-xs text-prussian">
                        {FORMAT_CURRENCY(prop.price)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComparison(prop.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                          marked
                            ? 'bg-coral text-white'
                            : 'bg-alabaster text-gray-600 hover:text-coral'
                        }`}
                      >
                        {marked ? 'Marked ✓' : '+ Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Main Map Area */}
        <div className="flex-1 h-[550px] lg:h-[calc(100vh-80px)] relative">
          
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <FlyToLocation targetCenter={mapCenter} />

            {/* Dynamic Tile Layer (Google Maps, Esri Satellite, or OpenStreetMap) */}
            {mapLayer === 'google-hybrid' && isGoogleKeyActive ? (
              <TileLayer
                attribution='&copy; Google Maps'
                url={`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleMapsApiKey}`}
                maxZoom={20}
              />
            ) : mapLayer === 'google-roadmap' && isGoogleKeyActive ? (
              <TileLayer
                attribution='&copy; Google Maps'
                url={`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleMapsApiKey}`}
                maxZoom={20}
              />
            ) : mapLayer === 'satellite' ? (
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}

            {/* House Markers for all Properties */}
            {properties.map(prop => {
              const isSelected = selectedProperty?.id === prop.id;
              const marked = isMarked(prop.id);

              return (
                <Marker
                  key={prop.id}
                  position={[prop.latitude, prop.longitude]}
                  icon={createHouseIcon(marked, isSelected)}
                  eventHandlers={{
                    click: () => {
                      setSelectedProperty(prop);
                    }
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300}>
                    <div className="p-1 font-sans space-y-2">
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={prop.featured_image || prop.photos?.[0]} 
                          alt={prop.title}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-1.5 left-1.5 bg-[#102542]/85 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          {prop.title_status}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-serif text-sm font-bold text-prussian leading-snug line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          {prop.micro_market} • {prop.built_up_sqft} sqft • {prop.bedrooms} BHK
                        </p>
                        <p className="font-serif text-sm font-bold text-coral mt-1">
                          {FORMAT_CURRENCY(prop.price)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-alabaster flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedPropertyForModal(prop)}
                          className="flex-1 py-1 px-2 rounded bg-[#102542] hover:bg-coral text-white font-bold text-[11px] uppercase transition-colors text-center"
                        >
                          View in Explore
                        </button>

                        <button
                          onClick={() => toggleComparison(prop.id)}
                          className={`py-1 px-2.5 rounded font-bold text-[11px] transition-colors border ${
                            marked 
                              ? 'bg-coral text-white border-coral' 
                              : 'bg-white text-gray-700 border-alabaster hover:border-coral'
                          }`}
                        >
                          {marked ? 'Marked ✓' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Map Hint Pill */}
          <div className="absolute bottom-5 left-5 z-[1000] bg-[#102542]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-coral/30 text-white text-xs font-semibold flex items-center space-x-2 shadow-luxury pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-coral animate-ping"></span>
            <span>Click any 🏠 house marker to preview property specs and mark for comparison.</span>
          </div>

        </div>

      </div>

    </div>
  );
}


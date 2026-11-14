import React, { useState, useEffect } from 'react';
import { fetchCadastralParcel } from '../lib/api';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Maximize2,
  FileCheck2,
  Compass,
  Crosshair,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Info,
  Navigation,
  Eye,
  Check
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Pinpoint Target Marker Icon
const pinpointIcon = new L.DivIcon({
  className: 'custom-pinpoint-pin',
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
    <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(248, 112, 96, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="background-color: #F87060; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(248,112,96,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 15px;">🎯</div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Cadastral Plot Centroid Marker
const centroidIcon = new L.DivIcon({
  className: 'custom-centroid-pin',
  html: `<div style="background-color: #102542; width: 32px; height: 32px; border-radius: 50%; border: 2.5px solid #F87060; box-shadow: 0 4px 15px rgba(16,37,66,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Boundary Stone (Khamba) Marker for corner vertices
const vertexIcon = (label) => new L.DivIcon({
  className: 'custom-vertex-pin',
  html: `<div style="background-color: #FFFFFF; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #102542; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #102542; font-size: 10px; font-weight: bold;">${label}</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Map event listener for interactive pinpoint clicking
function MapEventsHandler({ isPinpointMode, onPinpointClick, mapCenter }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (isPinpointMode) {
        onPinpointClick(e.latlng);
      }
    }
  });

  useEffect(() => {
    if (mapCenter) {
      map.flyTo([mapCenter.lat, mapCenter.lng], 17, { duration: 1.2 });
    }
  }, [mapCenter, map]);

  return null;
}

export default function BhuNakshaViewer() {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleKeyActive = Boolean(googleMapsApiKey && googleMapsApiKey !== 'YOUR_API_KEY_HERE');

  // Input states
  const [district, setDistrict] = useState('North Goa');
  const [taluka, setTaluka] = useState('Bardez');
  const [village, setVillage] = useState('Assagao');
  const [sheetNo, setSheetNo] = useState('04');
  const [surveyNo, setSurveyNo] = useState('142');
  const [subdivisionNo, setSubdivisionNo] = useState('6');
  const [gpsInput, setGpsInput] = useState('15.5907, 73.7842');
  const [activeMode, setActiveMode] = useState('pinpoint'); // 'pinpoint', 'hierarchy', 'gps'
  const [loading, setLoading] = useState(false);

  // Geospatial states
  const [isPinpointMode, setIsPinpointMode] = useState(true);
  const [pinpointCoords, setPinpointCoords] = useState({ lat: 15.5907, lng: 73.7842 });
  const [overlayOpacity, setOverlayOpacity] = useState(0.35); // 0.1 to 1.0
  const [mapLayer, setMapLayer] = useState(isGoogleKeyActive ? 'google-hybrid' : 'satellite');
  const [showAdjacentParcels, setShowAdjacentParcels] = useState(true);
  const [showVertexPoints, setShowVertexPoints] = useState(true);

  // Parcel data state
  const [parcelData, setParcelData] = useState({
    source: 'Directorate of Settlement & Land Records (DSLR) Goa',
    bhuNakshaPortalUrl: 'https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane',
    query: {
      district: 'North Goa',
      taluka: 'Bardez',
      village: 'Assagao',
      sheetNo: '04',
      surveyNo: '142',
      subdivisionNo: '6',
      centerCoordinates: { lat: 15.5907, lng: 73.7842 }
    },
    parcelDetails: {
      plotUlpIn: 'GA-GOA-ASS-142-6',
      surveyNumber: '142/6',
      cadastralSheetNo: 'DSLR/GOA/BARDEZ/ASSAGAO/SH-04',
      classOfLand: 'Bagayat / Settlement Zone A2 (Residential Permissible)',
      totalAreaSqMtrs: 1680,
      totalAreaSqFt: 18083,
      permissibleCoverage: 'FAR 0.80 / Max Height 9.0m (Ground + 1)',
      mutationEntryNo: 'ME/892/2021',
      mutationStatus: 'Certified by Mamlatdar of Bardez',
      lastSurveyDate: '2019-11-14',
      adjacentParcels: [
        { direction: 'North', surveyNo: '142/5', occupant: 'Private Portuguese Estate' },
        { direction: 'South', surveyNo: 'Public Village Road (6.0m Wide)', occupant: 'Panchayat' },
        { direction: 'East', surveyNo: '142/7', occupant: 'Green Orchard & Well' },
        { direction: 'West', surveyNo: '142/2', occupant: 'Ancestral Courtyard Villa' }
      ]
    },
    mapCenter: { lat: 15.5907, lng: 73.7842 },
    rawCoordinatesList: [
      [15.590245, 73.783435],
      [15.591220, 73.783690],
      [15.591415, 73.784880],
      [15.590375, 73.785050],
      [15.590245, 73.783435]
    ],
    adjacentPolygons: [
      {
        survey: '142/5 (North Neighbor)',
        coords: [
          [15.591220, 73.783690],
          [15.592100, 73.783850],
          [15.592250, 73.785100],
          [15.591415, 73.784880],
          [15.591220, 73.783690]
        ]
      },
      {
        survey: '142/7 (East Neighbor)',
        coords: [
          [15.591415, 73.784880],
          [15.591200, 73.786100],
          [15.590150, 73.786250],
          [15.590375, 73.785050],
          [15.591415, 73.784880]
        ]
      },
      {
        survey: '142/2 (West Neighbor)',
        coords: [
          [15.590245, 73.783435],
          [15.591220, 73.783690],
          [15.591050, 73.782100],
          [15.589950, 73.782050],
          [15.590245, 73.783435]
        ]
      }
    ]
  });

  const popularGoaLocations = [
    { label: 'Assagao (Badem)', coords: { lat: 15.5907, lng: 73.7842 }, survey: '142/6' },
    { label: 'Anjuna (De Mello)', coords: { lat: 15.5841, lng: 73.7439 }, survey: '88/2' },
    { label: 'Vagator (Ozran)', coords: { lat: 15.6028, lng: 73.7336 }, survey: '112/12' },
    { label: 'Siolim (Riverfront)', coords: { lat: 15.6264, lng: 73.7712 }, survey: '74/1' },
    { label: 'Aldona (Moira)', coords: { lat: 15.5898, lng: 73.8712 }, survey: '204/3' },
    { label: 'Morjim (Turtle Beach)', coords: { lat: 15.6322, lng: 73.7368 }, survey: '45/3' }
  ];

  // Fetch Cadastral info from backend / BhuNaksha API
  const handleLookup = async (overrideCoords = null) => {
    setLoading(true);
    let params;

    if (overrideCoords) {
      params = { gpsCoordinates: `${overrideCoords.lat.toFixed(6)}, ${overrideCoords.lng.toFixed(6)}` };
    } else if (activeMode === 'pinpoint' || activeMode === 'gps') {
      params = { gpsCoordinates: `${pinpointCoords.lat.toFixed(6)}, ${pinpointCoords.lng.toFixed(6)}` };
    } else {
      params = { district, taluka, village, sheetNo, surveyNo, subdivisionNo };
    }

    const parcel = await fetchCadastralParcel(params);
    if (parcel) {
      setParcelData(parcel);
      if (parcel.query) {
        setVillage(parcel.query.village || village);
        setTaluka(parcel.query.taluka || taluka);
        setSurveyNo(parcel.query.surveyNo || surveyNo);
        setSubdivisionNo(parcel.query.subdivisionNo || subdivisionNo);
      }
    }
    setLoading(false);
  };

  // Called when user clicks on map in Pinpoint Mode
  const handleMapPinpoint = (latlng) => {
    setPinpointCoords({ lat: latlng.lat, lng: latlng.lng });
    setGpsInput(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-alabaster gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#102542] text-coral flex items-center justify-center font-bold text-base shadow-sm">
              🗺️
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  Property Verification with BhuNaksha
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-[10px] font-bold uppercase tracking-wider border border-coral/20">
                  Geospatial Cadastre
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Pinpoint any plot on Google Maps satellite imagery and overlay official cadastral boundaries from <span className="font-mono text-coral font-semibold">www.bhunaksha.goa.gov.in</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Official Portal External Link */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <a
            href="https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#102542] hover:bg-[#1b2d4e] text-white text-xs font-bold transition-all shadow-md border border-coral/30"
          >
            <span>Open www.bhunaksha.goa.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5 text-coral" />
          </a>
        </div>
      </div>

      {/* Mode Selector & Quick Location Jump Chips */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Mode Tabs */}
          <div className="inline-flex rounded-xl bg-alabaster-100 p-1 border border-alabaster text-xs font-bold">
            <button
              onClick={() => { setActiveMode('pinpoint'); setIsPinpointMode(true); }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeMode === 'pinpoint'
                  ? 'bg-coral text-white shadow-coral-glow'
                  : 'text-gray-600 hover:text-coral'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>1. Pinpoint on Google Map</span>
            </button>

            <button
              onClick={() => { setActiveMode('hierarchy'); setIsPinpointMode(false); }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeMode === 'hierarchy'
                  ? 'bg-[#102542] text-white shadow'
                  : 'text-gray-600 hover:text-prussian'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>2. By Survey & Sheet No.</span>
            </button>

            <button
              onClick={() => { setActiveMode('gps'); setIsPinpointMode(false); }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeMode === 'gps'
                  ? 'bg-[#102542] text-white shadow'
                  : 'text-gray-600 hover:text-prussian'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>3. Manual GPS Coordinates</span>
            </button>
          </div>

          {/* Pinpoint Status Pill */}
          {activeMode === 'pinpoint' && (
            <div className="flex items-center space-x-2 text-xs text-gray-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping"></span>
              <span className="font-semibold text-prussian">Pinpoint Active:</span>
              <span className="font-mono text-gray-500">Click anywhere on Google Map to place pin</span>
            </div>
          )}
        </div>

        {/* Quick Jump Corridor Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">
            Quick Jump:
          </span>
          {popularGoaLocations.map((loc) => (
            <button
              key={loc.label}
              onClick={() => {
                setPinpointCoords(loc.coords);
                setGpsInput(`${loc.coords.lat}, ${loc.coords.lng}`);
                handleLookup(loc.coords);
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-alabaster-50 border border-alabaster text-gray-700 hover:text-coral hover:border-coral transition-all whitespace-nowrap font-medium flex items-center space-x-1 text-[11px]"
            >
              <span>{loc.label}</span>
              <span className="text-gray-400 font-mono text-[10px]">({loc.survey})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls for Survey Hierarchy Mode */}
      {activeMode === 'hierarchy' && (
        <div className="p-4 rounded-2xl bg-alabaster-50 border border-alabaster space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-prussian flex items-center space-x-2">
            <span>Directorate of Settlement & Land Records (DSLR) Cadastral Search</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs bg-white font-medium"
              >
                <option value="North Goa">North Goa</option>
                <option value="South Goa">South Goa</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Taluka</label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs bg-white font-medium"
              >
                <option value="Bardez">Bardez</option>
                <option value="Pernem">Pernem</option>
                <option value="Tiswadi">Tiswadi</option>
                <option value="Salcete">Salcete</option>
                <option value="Mormugao">Mormugao</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Village</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs bg-white font-medium"
              >
                <option value="Assagao">Assagao</option>
                <option value="Anjuna">Anjuna</option>
                <option value="Vagator">Vagator</option>
                <option value="Siolim">Siolim</option>
                <option value="Aldona">Aldona</option>
                <option value="Morjim">Morjim</option>
                <option value="Candolim">Candolim</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Sheet No.</label>
              <input
                type="text"
                value={sheetNo}
                onChange={(e) => setSheetNo(e.target.value)}
                placeholder="04"
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs font-mono bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Survey No.</label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="142"
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs font-mono bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Subdivision</label>
              <input
                type="text"
                value={subdivisionNo}
                onChange={(e) => setSubdivisionNo(e.target.value)}
                placeholder="6"
                className="w-full px-2.5 py-2 rounded-lg border border-alabaster text-xs font-mono bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => handleLookup()}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Querying BhuNaksha...' : 'Fetch Official Cadastral Boundary'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Controls for Manual GPS Mode */}
      {activeMode === 'gps' && (
        <div className="p-4 rounded-2xl bg-alabaster-50 border border-alabaster flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Enter Latitude, Longitude (WGS84 Coordinates)
            </label>
            <input
              type="text"
              value={gpsInput}
              onChange={(e) => setGpsInput(e.target.value)}
              placeholder="15.5907, 73.7842"
              className="w-full px-4 py-2 rounded-xl border border-alabaster text-xs font-mono bg-white focus:outline-none focus:border-coral"
            />
          </div>
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            className="w-full sm:w-auto mt-2 sm:mt-5 px-6 py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Loading...' : 'Overlay Cadastre'}</span>
          </button>
        </div>
      )}

      {/* Main Geospatial Workspace: Google Maps Satellite + Cadastral Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Google Map with Cadastral Vector Overlay */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Map Top Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-alabaster-100 p-2 rounded-2xl border border-alabaster text-xs">
            
            {/* Layer Switcher (Google Hybrid / Roadmap / Esri) */}
            <div className="flex items-center space-x-1 rounded-xl bg-white p-1 border border-alabaster">
              {isGoogleKeyActive ? (
                <>
                  <button
                    onClick={() => setMapLayer('google-hybrid')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      mapLayer === 'google-hybrid' ? 'bg-[#102542] text-white shadow-sm' : 'text-gray-600 hover:text-coral'
                    }`}
                  >
                    <span>Google Hybrid</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </button>

                  <button
                    onClick={() => setMapLayer('google-roadmap')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mapLayer === 'google-roadmap' ? 'bg-[#102542] text-white shadow-sm' : 'text-gray-600 hover:text-coral'
                    }`}
                  >
                    Google Roads
                  </button>

                  <button
                    onClick={() => setMapLayer('satellite')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mapLayer === 'satellite' ? 'bg-[#102542] text-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Esri Satellite
                  </button>
                </>
              ) : (
                <div className="px-2.5 py-1 text-xs font-semibold text-prussian flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>High-Res Satellite View</span>
                </div>
              )}
            </div>

            {/* Cadastral Layer Toggles */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-[11px] font-semibold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAdjacentParcels}
                  onChange={(e) => setShowAdjacentParcels(e.target.checked)}
                  className="rounded text-coral focus:ring-coral"
                />
                <span>Adjacent Plots</span>
              </label>

              <label className="flex items-center space-x-1 text-[11px] font-semibold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVertexPoints}
                  onChange={(e) => setShowVertexPoints(e.target.checked)}
                  className="rounded text-coral focus:ring-coral"
                />
                <span>Corner Stones</span>
              </label>
            </div>

            {/* Opacity Slider for Cadastral Overlay */}
            <div className="flex items-center space-x-2 px-2">
              <span className="text-[10px] uppercase font-bold text-gray-500">Overlay Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                className="w-20 accent-coral cursor-pointer"
                title={`Cadastral fill opacity: ${Math.round(overlayOpacity * 100)}%`}
              />
              <span className="text-[10px] font-mono text-gray-600 w-6">
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>

          </div>

          {/* Map Canvas Container */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-prussian shadow-luxury h-[480px]">
            
            <MapContainer
              key={`${parcelData.mapCenter.lat}-${parcelData.mapCenter.lng}`}
              center={[parcelData.mapCenter.lat, parcelData.mapCenter.lng]}
              zoom={17}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              {/* Event handler for pinpoint click */}
              <MapEventsHandler
                isPinpointMode={isPinpointMode}
                onPinpointClick={handleMapPinpoint}
                mapCenter={parcelData.mapCenter}
              />

              {/* Dynamic Tile Layer (Google Maps or Esri Satellite) */}
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
              ) : (
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, USDA, USGS'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              )}

              {/* Adjacent / Neighboring Cadastral Boundary Plots */}
              {showAdjacentParcels && parcelData.adjacentPolygons?.map((adj, idx) => (
                <Polygon
                  key={idx}
                  positions={adj.coords}
                  pathOptions={{
                    color: '#64748B', // Slate grey border
                    weight: 1.5,
                    dashArray: '4, 4',
                    fillColor: '#94A3B8',
                    fillOpacity: 0.12
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <strong>Abutting Cadastral Plot:</strong>
                      <p className="font-mono text-prussian">{adj.survey}</p>
                    </div>
                  </Popup>
                </Polygon>
              ))}

              {/* Official Target Cadastral Boundary Polygon (DSLR Goa) */}
              <Polygon
                positions={parcelData.rawCoordinatesList}
                pathOptions={{
                  color: '#F87060', // Neon Coral border
                  weight: 3.5,
                  dashArray: '6, 6',
                  fillColor: '#F87060',
                  fillOpacity: overlayOpacity
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs space-y-1">
                    <strong className="text-prussian font-serif text-sm">
                      Survey {parcelData.parcelDetails.surveyNumber}
                    </strong>
                    <div className="text-[11px] text-gray-600">
                      {parcelData.query.village}, {parcelData.query.taluka}
                    </div>
                    <div className="text-coral font-bold text-xs">
                      Area: {parcelData.parcelDetails.totalAreaSqFt?.toLocaleString('en-IN')} sq.ft ({parcelData.parcelDetails.totalAreaSqMtrs} m²)
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Zoning: {parcelData.parcelDetails.classOfLand}
                    </div>
                  </div>
                </Popup>
              </Polygon>

              {/* Corner Boundary Stones (Khamba vertex pins) */}
              {showVertexPoints && parcelData.rawCoordinatesList.slice(0, 4).map((pt, i) => (
                <Marker key={i} position={pt} icon={vertexIcon(`C${i + 1}`)}>
                  <Popup>
                    <div className="text-[11px] font-mono">
                      <strong>Boundary Corner C{i + 1}</strong>
                      <p>Lat: {pt[0].toFixed(6)}</p>
                      <p>Lng: {pt[1].toFixed(6)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Pinpoint Location Marker (Interactive Draggable Target) */}
              <Marker
                position={[pinpointCoords.lat, pinpointCoords.lng]}
                icon={pinpointIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    setPinpointCoords({ lat: pos.lat, lng: pos.lng });
                    setGpsInput(`${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs space-y-2">
                    <strong className="text-coral font-bold">📍 Pinpoint Dropped</strong>
                    <p className="font-mono text-[10px] text-gray-600">
                      {pinpointCoords.lat.toFixed(6)}, {pinpointCoords.lng.toFixed(6)}
                    </p>
                    <button
                      onClick={() => handleLookup()}
                      className="w-full py-1 px-2 rounded bg-coral text-white font-bold text-[10px] uppercase shadow-sm"
                    >
                      Verify Boundary at Pinpoint
                    </button>
                  </div>
                </Popup>
              </Marker>

              {/* Plot Centroid Marker */}
              <Marker position={[parcelData.mapCenter.lat, parcelData.mapCenter.lng]} icon={centroidIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong>Cadastral Plot Centroid</strong>
                    <p className="text-[10px] text-gray-500 font-mono">
                      Survey {parcelData.parcelDetails.surveyNumber}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Floating Cadastral Sheet Badge */}
            <div className="absolute top-3 left-3 z-[1000] bg-[#102542]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-coral/30 text-white text-[11px] font-semibold flex items-center space-x-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse"></span>
              <span className="font-mono">{parcelData.parcelDetails.cadastralSheetNo}</span>
            </div>

            {/* Pinpoint Active Overlay Card */}
            {activeMode === 'pinpoint' && (
              <div className="absolute bottom-3 left-3 z-[1000] bg-[#102542]/95 backdrop-blur-md p-3 rounded-2xl border border-coral/40 text-white shadow-xl max-w-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-coral flex items-center space-x-1">
                    <Crosshair className="w-3 h-3" />
                    <span>Pinpoint Location</span>
                  </span>
                  <span className="font-mono text-[10px] text-gray-300">
                    {pinpointCoords.lat.toFixed(4)}, {pinpointCoords.lng.toFixed(4)}
                  </span>
                </div>
                <button
                  onClick={() => handleLookup()}
                  disabled={loading}
                  className="w-full py-1.5 px-3 rounded-lg bg-coral hover:bg-coral-600 text-white font-bold text-xs shadow-coral-glow transition-all flex items-center justify-center space-x-1.5"
                >
                  <Search className="w-3 h-3" />
                  <span>{loading ? 'Verifying...' : 'Verify Cadastral Boundary'}</span>
                </button>
              </div>
            )}

            {/* Provider Pill */}
            <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] text-gray-700 font-mono border flex items-center space-x-1.5 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isGoogleKeyActive ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
              <span>{isGoogleKeyActive ? 'Google Maps Hybrid + DSLR Vector Cadastre' : 'Satellite + DSLR Cadastre'}</span>
            </div>

          </div>

          <p className="text-[11px] text-gray-500 italic">
            💡 Tip: Click anywhere on Google Maps to move the pinpoint target, or drag the 🎯 marker to align with parcel structures.
          </p>
        </div>

        {/* Right Column: Official Cadastral & Land Record Intelligence Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-alabaster-50 border border-alabaster space-y-4 shadow-sm">
            
            {/* Government Seal & Title Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-alabaster">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral">
                  Government of Goa • DSLR
                </span>
                <h4 className="font-serif text-xl font-bold text-prussian mt-0.5">
                  Survey No. {parcelData.parcelDetails.surveyNumber}
                </h4>
                <p className="text-xs text-gray-500">
                  {parcelData.query.village}, Taluka {parcelData.query.taluka}, {parcelData.query.district}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono px-2.5 py-1 bg-white rounded-lg border border-alabaster text-prussian font-bold shadow-sm inline-block">
                  {parcelData.parcelDetails.plotUlpIn}
                </span>
                <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center justify-end space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>DSLR Cadastre Verified</span>
                </div>
              </div>
            </div>

            {/* Cadastral Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-alabaster shadow-sm">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Surveyed Plot Area</div>
                <div className="font-serif text-base font-bold text-prussian mt-0.5">
                  {parcelData.parcelDetails.totalAreaSqMtrs} m²
                </div>
                <div className="text-[11px] text-coral font-semibold">
                  {parcelData.parcelDetails.totalAreaSqFt?.toLocaleString('en-IN')} sq.ft
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-alabaster shadow-sm">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Permissible Coverage</div>
                <div className="font-serif text-base font-bold text-prussian mt-0.5">
                  FAR 0.80
                </div>
                <div className="text-[11px] text-gray-500">
                  Max Height 9.0m (G+1)
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-alabaster shadow-sm col-span-2">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Town & Country Planning (TCP) Zoning</div>
                <div className="font-semibold text-prussian text-xs mt-0.5 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{parcelData.parcelDetails.classOfLand}</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-alabaster shadow-sm col-span-2">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Mutation Status (Form D)</div>
                <div className="font-semibold text-prussian text-xs mt-0.5">
                  {parcelData.parcelDetails.mutationStatus} ({parcelData.parcelDetails.mutationEntryNo})
                </div>
              </div>
            </div>

            {/* Abutting & Neighboring Parcels (Boundary Verification) */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-prussian flex items-center justify-between">
                <span>Abutting Boundary Verification</span>
                <span className="text-[10px] text-gray-500 font-normal">Adjacent Plots</span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {parcelData.parcelDetails.adjacentParcels.map((adj, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white border border-alabaster flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-coral/10 text-coral font-bold text-[10px] flex items-center justify-center font-mono">
                        {adj.direction[0]}
                      </span>
                      <div>
                        <span className="font-bold text-prussian">{adj.direction}: </span>
                        <span className="font-mono text-gray-700">{adj.surveyNo}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium truncate max-w-[140px]">
                      {adj.occupant}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official BhuNaksha Portal Cross-Check CTA */}
            <div className="pt-2">
              <a
                href={`https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#102542] hover:bg-prussian-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md border border-coral/30"
              >
                <span>Verify on www.bhunaksha.goa.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-coral" />
              </a>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Cross-references DSLR Cadastral Sheet {parcelData.parcelDetails.cadastralSheetNo} with official Goa land records.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { FORMAT_CURRENCY } from '../lib/sampleData';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  PlusCircle, 
  Trash2, 
  LogOut, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Send,
  AlertOctagon,
  X,
  Zap,
  Droplets
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfilePage({ setActiveTab }) {
  const { user, logout, eraseAccountCompletely } = useAuth();
  const { properties, addProperty, bids } = useProperty();

  const [activeSection, setActiveSection] = useState('bids'); // 'bids', 'add-property', 'my-listings'
  const [showEraseModal, setShowEraseModal] = useState(false);
  const [eraseConfirmText, setEraseConfirmText] = useState('');
  const [erasing, setErasing] = useState(false);

  // Add Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    property_type: 'villa',
    listing_type: 'sale',
    price: '',
    built_up_sqft: '',
    plot_sqft: '',
    bedrooms: '3',
    bathrooms: '3',
    micro_market: 'Assagao',
    district: 'North Goa',
    taluka: 'Bardez',
    village: 'Assagao',
    sheet_no: '04',
    survey_no: '142',
    subdivision_no: '6',
    address: '',
    electricity_status: '3-Phase Grid Connected (15kW+)',
    water_status: 'PWD Municipal Supply + Sweet Water Well',
    latitude: '15.5907',
    longitude: '73.7842',
    photos: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    cap_rate: '7.5',
    cash_on_cash_return: '11.2',
    net_rental_yield: '6.5',
    projected_5yr_cagr: '15.0',
    liquidity_risk: 'Low',
    company_name: user?.company_name || '',
    company_logo_url: user?.company_logo_url || ''
  });
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter listings owned by this user
  const userListings = properties.filter(p => !user || p.user_id === user.id || p.seller_email === user.email);

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price || !newProp.address) {
      alert('Please fill in required fields: Title, Price, and Address.');
      return;
    }

    const photosArr = newProp.photos.split(',').map(s => s.trim()).filter(Boolean);

    await addProperty({
      ...newProp,
      user_id: user?.id || 'user-active',
      seller_name: `${user?.first_name || 'Seller'} ${user?.last_name || ''}`.trim(),
      seller_phone: user?.phone || '+91 98221 44552',
      seller_email: user?.email || 'seller@kshetram.luxury',
      seller_company: newProp.company_name || user?.company_name || 'Independent Owner',
      seller_logo_url: newProp.company_logo_url || user?.company_logo_url || '',
      photos: photosArr.length > 0 ? photosArr : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      featured_image: photosArr[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    });

    setFormSuccess(true);
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setFormSuccess(false);
      setActiveSection('my-listings');
    }, 1500);
  };

  const handleEraseAccount = async () => {
    if (eraseConfirmText !== 'ERASE PERMANENTLY') {
      alert('Please type ERASE PERMANENTLY in capital letters to confirm.');
      return;
    }

    setErasing(true);
    await eraseAccountCompletely();
    setErasing(false);
    setShowEraseModal(false);
    setActiveTab('welcome');
  };

  return (
    <div className="bg-alabaster-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User Profile Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-alabaster">
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-coral flex items-center justify-center font-serif text-white text-2xl font-bold shadow-coral-glow">
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif text-2xl font-bold text-prussian">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-coral-50 text-coral border border-coral-200">
                    {user?.role || 'Seller'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.company_name ? `${user.company_name} • ` : ''}{user?.email}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-2">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-coral" />
                    <span>{user?.phone || '+91 98221 44552'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-coral" />
                    <span>{user?.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Account Quick Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { logout(); setActiveTab('welcome'); }}
                className="px-4 py-2 rounded-xl bg-alabaster-100 hover:bg-alabaster-200 text-gray-700 text-xs font-bold transition-all flex items-center space-x-1.5 border border-alabaster"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>Log Out</span>
              </button>

              <button
                onClick={() => setShowEraseModal(true)}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center space-x-1.5 border border-red-200"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Erase Data Completely</span>
              </button>
            </div>

          </div>

          {/* Tab Navigation for Profile */}
          <div className="flex space-x-2 pt-6">
            <button
              onClick={() => setActiveSection('bids')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === 'bids'
                  ? 'bg-[#102542] text-white shadow'
                  : 'bg-alabaster-50 text-gray-600 hover:text-prussian'
              }`}
            >
              Interested Buyer Bids ({bids.length})
            </button>

            <button
              onClick={() => setActiveSection('add-property')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === 'add-property'
                  ? 'bg-coral text-white shadow-coral-glow'
                  : 'bg-alabaster-50 text-gray-600 hover:text-coral'
              }`}
            >
              + Add Property Listing
            </button>

            <button
              onClick={() => setActiveSection('my-listings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === 'my-listings'
                  ? 'bg-[#102542] text-white shadow'
                  : 'bg-alabaster-50 text-gray-600 hover:text-prussian'
              }`}
            >
              My Listed Estates ({userListings.length})
            </button>
          </div>
        </div>

        {/* SECTION A: Bids & WhatsApp Notifications */}
        {activeSection === 'bids' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-coral text-white flex items-center justify-center font-bold text-sm">
                  🤝
                </span>
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  Interested Buyer Bids & WhatsApp Notifications
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Real-time verified cash offers from buyers. Automated WhatsApp notifications alert you directly to negotiate or accept.
              </p>
            </div>

            {bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map(bid => {
                  const cleanPhone = (user?.phone || '+919822144552').replace(/[^0-9]/g, '');
                  const waText = `Hello ${bid.buyer_name}, this is ${user?.first_name || 'Seller'} regarding your Kshetram offer of ₹${(bid.bid_amount / 10000000).toFixed(2)} Cr. Let's discuss terms.`;
                  const waLink = `https://wa.me/${bid.buyer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

                  return (
                    <div
                      key={bid.id}
                      className="p-5 rounded-2xl bg-alabaster-50 border border-alabaster hover:border-coral transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-prussian">
                            {bid.buyer_name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                            Status: {bid.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(bid.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="font-serif text-xl font-bold text-coral">
                          Offer: {FORMAT_CURRENCY(bid.bid_amount)}
                        </div>

                        <p className="text-xs text-gray-600 italic">
                          "{bid.message}"
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-1">
                          <span>Phone: <strong>{bid.buyer_phone}</strong></span>
                          <span>•</span>
                          <span>Email: <strong>{bid.buyer_email}</strong></span>
                        </div>
                      </div>

                      {/* WhatsApp Trigger Button */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow transition-all flex items-center justify-center space-x-1.5"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Reply on WhatsApp</span>
                        </a>

                        <button
                          onClick={() => alert(`Bid of ${FORMAT_CURRENCY(bid.bid_amount)} accepted. Generating escrow deed draft.`)}
                          className="px-4 py-2.5 rounded-xl bg-[#102542] hover:bg-[#1b2d4e] text-white font-bold text-xs uppercase transition-all"
                        >
                          Accept Offer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm">
                No active buyer bids yet. As buyers submit cash offers on your properties, they will appear here and notify your phone via WhatsApp.
              </div>
            )}
          </div>
        )}

        {/* SECTION B: Add Property Form */}
        {activeSection === 'add-property' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-lg bg-coral text-white flex items-center justify-center font-bold text-sm">
                  +
                </span>
                <h3 className="font-serif text-2xl font-bold text-prussian">
                  List High-Value Property For Sale
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Provide comprehensive specifications for institutional buyers, including cadastral GPS, Form I & XIV details, and financial returns.
              </p>
            </div>

            {formSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Property listed successfully! Added to Explore and Cadastral Map.</span>
              </div>
            )}

            <form onSubmit={handleCreateProperty} className="space-y-6">
              
              {/* General Property Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-prussian mb-1">
                    Estate Title *
                  </label>
                  <input
                    type="text"
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    placeholder="e.g. Casa de Palma - Restored Indo-Portuguese Villa"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-alabaster text-sm focus:outline-none focus:border-coral font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-prussian mb-1">
                    Asking Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    value={newProp.price}
                    onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    placeholder="65000000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-alabaster text-sm font-mono font-bold focus:outline-none focus:border-coral"
                  />
                </div>
              </div>

              {/* Spatial Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Micro-Market</label>
                  <select
                    value={newProp.micro_market}
                    onChange={(e) => setNewProp({ ...newProp, micro_market: e.target.value, village: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs bg-white font-medium focus:outline-none focus:border-coral"
                  >
                    <option value="Assagao">Assagao</option>
                    <option value="Anjuna">Anjuna</option>
                    <option value="Vagator">Vagator</option>
                    <option value="Siolim">Siolim</option>
                    <option value="Aldona">Aldona</option>
                    <option value="Porvorim">Porvorim</option>
                    <option value="Morjim">Morjim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Built-Up Area (sqft)</label>
                  <input
                    type="number"
                    value={newProp.built_up_sqft}
                    onChange={(e) => setNewProp({ ...newProp, built_up_sqft: e.target.value })}
                    placeholder="3000"
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Plot Area (sqft)</label>
                  <input
                    type="number"
                    value={newProp.plot_sqft}
                    onChange={(e) => setNewProp({ ...newProp, plot_sqft: e.target.value })}
                    placeholder="6500"
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms</label>
                  <select
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs bg-white font-medium"
                  >
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK Grand</option>
                  </select>
                </div>
              </div>

              {/* Cadastral Coordinates & BhuNaksha */}
              <div className="p-4 rounded-xl bg-alabaster-50 border border-alabaster space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-prussian">
                  Cadastral Location & BhuNaksha Parameters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">GPS Latitude</label>
                    <input
                      type="text"
                      value={newProp.latitude}
                      onChange={(e) => setNewProp({ ...newProp, latitude: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-alabaster text-xs font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">GPS Longitude</label>
                    <input
                      type="text"
                      value={newProp.longitude}
                      onChange={(e) => setNewProp({ ...newProp, longitude: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-alabaster text-xs font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Survey No.</label>
                    <input
                      type="text"
                      value={newProp.survey_no}
                      onChange={(e) => setNewProp({ ...newProp, survey_no: e.target.value })}
                      placeholder="142"
                      className="w-full px-3 py-1.5 rounded-lg border border-alabaster text-xs font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">Subdivision No.</label>
                    <input
                      type="text"
                      value={newProp.subdivision_no}
                      onChange={(e) => setNewProp({ ...newProp, subdivision_no: e.target.value })}
                      placeholder="6"
                      className="w-full px-3 py-1.5 rounded-lg border border-alabaster text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Full Physical Address *</label>
                  <input
                    type="text"
                    value={newProp.address}
                    onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                    placeholder="Badem Road, Near St. Anthony Chapel, Assagao, Goa 403507"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs bg-white"
                  />
                </div>
              </div>

              {/* Photos & Company Branding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Photo URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProp.photos}
                    onChange={(e) => setNewProp({ ...newProp, photos: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company / Developer Name (If applicable)
                  </label>
                  <input
                    type="text"
                    value={newProp.company_name}
                    onChange={(e) => setNewProp({ ...newProp, company_name: e.target.value })}
                    placeholder="e.g. Sequeira & Sons Heritage Estates"
                    className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs"
                  />
                </div>
              </div>

              {/* Essential Utilities: Electricity & Water Availability */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-prussian">
                      Essential Utilities Availability
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                      Mandatory for Sale
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">Electricity & Water check verified by buyer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Electricity Power Status *</span>
                    </label>
                    <select
                      value={newProp.electricity_status}
                      onChange={(e) => setNewProp({ ...newProp, electricity_status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-amber-200 text-xs bg-white font-medium focus:outline-none focus:border-coral"
                    >
                      <option value="3-Phase Grid Connected (15kW+)">3-Phase Grid Connected (15kW+ Sanctioned)</option>
                      <option value="3-Phase Grid Connected (10kW)">3-Phase Grid Connected (10kW)</option>
                      <option value="Single Phase Grid Connected (5kW)">Single Phase Grid Connected (5kW)</option>
                      <option value="Connection Feasible (Transformer Nearby < 100m)">Connection Feasible (Transformer Nearby &lt; 100m)</option>
                      <option value="Off-Grid Solar + Generator System">Off-Grid Solar + Generator System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-600" />
                      <span>Water Supply Status *</span>
                    </label>
                    <select
                      value={newProp.water_status}
                      onChange={(e) => setNewProp({ ...newProp, water_status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-amber-200 text-xs bg-white font-medium focus:outline-none focus:border-coral"
                    >
                      <option value="PWD Municipal Supply + Sweet Water Well">PWD Municipal Supply + Sweet Water Well</option>
                      <option value="PWD Municipal Pipeline Connected">PWD Municipal Pipeline Connected</option>
                      <option value="Private Borewell / Sweet Water Well">Private Borewell / Sweet Water Well</option>
                      <option value="Dual Borewell + Overhead Reservoir">Dual Borewell + Overhead Reservoir</option>
                      <option value="Natural Spring / Tanker Supply Dependent">Natural Spring / Tanker Supply Dependent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  placeholder="Describe heritage features, high ceilings, private pool, and title audit status..."
                  className="w-full p-3 rounded-xl border border-alabaster text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-sm uppercase tracking-wider shadow-coral-glow transition-all flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Publish Listing to Kshetram Database</span>
              </button>

            </form>
          </div>
        )}

        {/* SECTION C: My Listed Estates */}
        {activeSection === 'my-listings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster shadow-luxury space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-prussian">
                My Listed Properties ({userListings.length})
              </h3>
              <p className="text-xs text-gray-500">
                Estates actively published under your account credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map(prop => (
                <div key={prop.id} className="rounded-2xl border border-alabaster overflow-hidden bg-white shadow-sm flex flex-col">
                  <img
                    src={prop.featured_image || prop.photos?.[0]}
                    alt={prop.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-coral">{prop.micro_market}</span>
                      <h4 className="font-serif text-sm font-bold text-prussian mt-0.5">{prop.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{prop.bedrooms} BHK • {prop.built_up_sqft} sqft</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-alabaster flex items-center justify-between">
                      <span className="font-serif font-bold text-coral text-sm">{FORMAT_CURRENCY(prop.price)}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        {prop.title_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ERASE DATA CONFIRMATION MODAL */}
      {showEraseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-prussian-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border-2 border-red-500 shadow-2xl space-y-4">
            
            <div className="flex items-center space-x-3 text-red-600">
              <AlertOctagon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-red-950">
                  Permanent Account & Data Erasure
                </h3>
                <p className="text-xs text-red-700">Right to be Forgotten (GDPR / Indian DPDP Act)</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              This action is <strong>irreversible</strong>. All your personal profile data, property listings, incoming bids, and pre-audit logs will be permanently deleted from the Supabase database.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Type <span className="text-red-600 font-mono">ERASE PERMANENTLY</span> to confirm:
              </label>
              <input
                type="text"
                value={eraseConfirmText}
                onChange={(e) => setEraseConfirmText(e.target.value)}
                placeholder="ERASE PERMANENTLY"
                className="w-full px-3 py-2 rounded-xl border border-red-300 text-xs font-mono font-bold focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => setShowEraseModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-alabaster-100 hover:bg-alabaster-200 text-gray-700 font-bold text-xs uppercase"
              >
                Cancel
              </button>

              <button
                onClick={handleEraseAccount}
                disabled={erasing || eraseConfirmText !== 'ERASE PERMANENTLY'}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs uppercase shadow-md transition-all"
              >
                {erasing ? 'Wiping Records...' : 'Confirm Wipe'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { 
  Compass, 
  MapPin, 
  TrendingUp, 
  User, 
  Scale, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Building2,
  LogOut
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, switchRole } = useAuth();
  const { markedForComparison } = useProperty();

  const navLinks = [
    { id: 'welcome', label: 'Welcome', icon: Sparkles },
    { id: 'home', label: 'Home & AI Hub', icon: Mic },
    { id: 'explore', label: 'Explore Estates', icon: Compass },
    { id: 'maps', label: 'Cadastral Maps', icon: MapPin },
    { id: 'investor', label: 'Investor Portal', icon: TrendingUp },
  ];

  const roleColors = {
    buyer: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    seller: 'bg-coral-50 text-coral-600 border-coral-200',
    broker: 'bg-blue-100 text-blue-800 border-blue-300',
    rent: 'bg-amber-100 text-amber-800 border-amber-300'
  };

  return (
    <header className="sticky top-0 z-50 bg-[#102542] text-white shadow-luxury border-b border-coral/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('welcome')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center shadow-coral-glow transition-transform group-hover:scale-105">
              <span className="font-serif font-bold text-white text-2xl tracking-tighter">क्ष</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-extrabold text-2xl tracking-wider text-white">
                  KSHETRAM
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-coral/20 text-coral px-2 py-0.5 rounded-full border border-coral/30">
                  RAG & AI
                </span>
              </div>
              <p className="text-[11px] text-alabaster tracking-widest uppercase font-medium">
                Goa Luxury & Cadastral Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-coral shadow-inner border border-coral/30'
                      : 'text-alabaster hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-coral' : 'text-alabaster-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Controls & Comparison Pill */}
          <div className="flex items-center space-x-3">
            
            {/* Comparison Counter */}
            <button
              onClick={() => setActiveTab('home')}
              title="View Marked Comparisons"
              className="relative p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-alabaster hover:text-white border border-white/10 transition-all flex items-center space-x-1.5"
            >
              <Scale className="w-4 h-4 text-coral" />
              <span className="hidden sm:inline text-xs font-semibold text-alabaster">Compare</span>
              {markedForComparison.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-coral-glow">
                  {markedForComparison.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                {/* Role Switcher Pill */}
                <select
                  value={user.role}
                  onChange={(e) => switchRole(e.target.value)}
                  className="hidden sm:block text-xs font-semibold uppercase tracking-wider py-1.5 px-2.5 rounded-md bg-white/10 text-alabaster border border-white/20 focus:outline-none focus:border-coral cursor-pointer"
                  title="Switch Active Persona"
                >
                  <option value="buyer" className="bg-[#102542] text-white">Role: Buyer</option>
                  <option value="seller" className="bg-[#102542] text-white">Role: Seller</option>
                  <option value="broker" className="bg-[#102542] text-white">Role: Broker</option>
                  <option value="rent" className="bg-[#102542] text-white">Role: Rent</option>
                </select>

                {/* Profile Button */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                    activeTab === 'profile'
                      ? 'bg-coral text-white border-coral shadow-coral-glow'
                      : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-coral-500 text-white flex items-center justify-center text-xs font-bold font-serif">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden md:inline">
                    {user.first_name}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-4 py-2 rounded-lg bg-coral hover:bg-coral-600 text-white text-xs font-bold uppercase tracking-wider shadow-coral-glow transition-all"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}


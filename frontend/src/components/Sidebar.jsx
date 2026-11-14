import React, { useState } from 'react';
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
  LogOut,
  Menu,
  X,
  ChevronRight,
  Layers,
  HelpCircle,
  Bot,
  MessageSquare
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout, switchRole } = useAuth();
  const { markedForComparison } = useProperty();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: 'welcome', label: 'Welcome', subtitle: 'Overview & Mission', icon: Sparkles },
    { id: 'home', label: 'AI Hub & Tools', subtitle: 'Voice, AVM, Vault, Cadastre', icon: Mic },
    { id: 'chatbot', label: 'AI Land Advisor', subtitle: 'Legal, Zoning & Valuation Q&A', icon: Bot, badge: 'Gemini' },
    { id: 'explore', label: 'Explore Properties', subtitle: 'Goa Luxury Catalog', icon: Compass },
    { id: 'maps', label: 'Cadastral Maps', subtitle: 'Satellite & Plot Overlay', icon: MapPin },
    { id: 'investor', label: 'Investor Portal', subtitle: 'Yields & LTV Modeling', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Bids', subtitle: 'Listings & WhatsApp Bids', icon: User },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Bar (Only visible on screens smaller than md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#102542] text-white px-4 py-3 flex items-center justify-between border-b border-coral/20 shadow-md">
        <div 
          onClick={() => handleNavClick('welcome')}
          className="flex items-center space-x-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center text-white font-serif font-bold text-base shadow-coral-glow">
            क्ष
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider text-white">KSHETRAM</span>
            <span className="text-[9px] uppercase tracking-widest text-coral ml-1.5 font-bold">AI</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {markedForComparison.length > 0 && (
            <button
              onClick={() => handleNavClick('home')}
              className="px-2 py-1 rounded bg-coral text-white text-xs font-bold flex items-center space-x-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{markedForComparison.length}</span>
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-alabaster focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-coral" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Left Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#102542] text-white flex flex-col justify-between border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div 
            onClick={() => handleNavClick('welcome')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center shadow-coral-glow transition-transform group-hover:scale-105 flex-shrink-0">
              <span className="font-serif font-bold text-white text-2xl tracking-tighter">क्ष</span>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-extrabold text-2xl tracking-wider text-white">
                  KSHETRAM
                </span>
              </div>
              <p className="text-[10px] text-alabaster tracking-widest uppercase font-semibold text-coral/90">
                Goa Cadastral & AI Intelligence
              </p>
            </div>
          </div>

          {/* User Persona & Role Card */}
          {user ? (
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-coral text-white font-serif font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Switcher Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-400">Persona</span>
                <select
                  value={user.role}
                  onChange={(e) => switchRole(e.target.value)}
                  className="text-[11px] font-bold py-1 px-2 rounded bg-[#162f52] text-coral border border-coral/30 focus:outline-none cursor-pointer"
                  title="Switch Persona Mode"
                >
                  <option value="buyer">Role: Buyer</option>
                  <option value="seller">Role: Seller</option>
                  <option value="broker">Role: Broker</option>
                  <option value="rent">Role: Rent</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-bold uppercase tracking-wider shadow-coral-glow transition-all text-center"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Center: Navigation Links */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Navigation Menu
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-coral/20 to-white/5 text-white border-l-4 border-coral shadow-inner'
                    : 'text-alabaster hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-coral text-white shadow-coral-glow' : 'bg-white/5 text-gray-400 group-hover:text-coral'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-xs font-bold leading-tight ${isActive ? 'text-coral' : 'text-white'}`}>
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-coral/20 text-coral font-bold border border-coral/30">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-light truncate mt-0.5">
                      {link.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${
                  isActive ? 'text-coral translate-x-0.5' : 'text-gray-500 opacity-40 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}

          {/* Quick AI Advisor Launch Card in Sidebar */}
          <div className="pt-3 px-1">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-coral/15 via-[#162f52] to-[#102542] border border-coral/30 space-y-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-coral text-white flex items-center justify-center shadow-coral-glow flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">Ask KSHETRAM AI</span>
                </div>
              </div>
              <p className="text-[10px] text-alabaster/80 leading-relaxed font-light">
                Instant questions on Portuguese Civil Code, Form I & XIV, BhuNaksha & Sanad.
              </p>
              <button
                onClick={() => handleNavClick('chatbot')}
                className="w-full py-1.5 px-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-[11px] shadow-sm transition-all text-center block uppercase tracking-wider"
              >
                Launch Advisor →
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Section: Comparison Badge & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          
          {/* Comparison Quick Access Pill */}
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
              markedForComparison.length > 0
                ? 'bg-coral/15 border-coral/40 text-coral hover:bg-coral/25 shadow-sm'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-coral" />
              <span>Marked for Compare</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              markedForComparison.length > 0 ? 'bg-coral text-white shadow-coral-glow' : 'bg-white/10 text-gray-400'
            }`}>
              {markedForComparison.length}
            </span>
          </button>

          {/* User Sign-Out / Footer Info */}
          {user ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-gray-400 font-mono">
                v1.0.0 • Goa RAG
              </span>
              <button
                onClick={() => { logout(); handleNavClick('welcome'); }}
                className="flex items-center space-x-1 text-gray-400 hover:text-coral transition-colors py-1 px-2 rounded hover:bg-white/5"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="text-center text-[10px] text-gray-400">
              KSHETRAM Platform • Goa Luxury Real Estate
            </div>
          )}

        </div>
      </aside>
    </>
  );
}


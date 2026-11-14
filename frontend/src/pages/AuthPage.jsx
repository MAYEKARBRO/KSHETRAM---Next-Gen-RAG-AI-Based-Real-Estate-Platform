import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Briefcase,
  MapPin,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AuthPage({ onAuthenticated }) {
  const { login, signup, loading, isSupabaseLive } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer', 'seller', 'rent', 'broker'
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (isSignUp) {
      if (!firstName.trim() || !email.trim() || !password || !phone.trim()) {
        setError('Please fill in all required fields (First Name, Email, Password, and Phone Number).');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const res = await signup({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        companyName,
        companyLogoUrl
      });

      if (res.success) {
        if (res.sessionActive) {
          if (onAuthenticated) onAuthenticated();
        } else {
          setInfoMessage(res.message || 'Registration complete! You can now sign in.');
          setIsSignUp(false);
        }
      } else {
        setError(res.error || 'Failed to create account. Please verify your details.');
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter both your email and password.');
        return;
      }

      const res = await login(email, password);
      if (res.success) {
        if (onAuthenticated) onAuthenticated();
      } else {
        const errMsg = res.error || '';
        if (errMsg.toLowerCase().includes('email not confirmed')) {
          setError('Email not confirmed yet. Please check your email inbox to verify your account, OR turn OFF "Confirm email" in Supabase Dashboard (Authentication > Providers > Email) for immediate login.');
        } else if (errMsg.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid login credentials. If you haven\'t created an account yet, click "Create Account" above first.');
        } else {
          setError(errMsg || 'Failed to sign in. Please verify your credentials.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#102542] text-white flex flex-col justify-between selection:bg-coral selection:text-white">
      
      {/* Top Brand Bar */}
      <header className="border-b border-white/10 px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-coral-glow">
            क्ष
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-extrabold text-2xl tracking-wider text-white">
                KSHETRAM
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-coral/20 text-coral px-2 py-0.5 rounded-full border border-coral/30">
                AI & CADASTRE
              </span>
            </div>
            <p className="text-[11px] text-alabaster tracking-widest uppercase font-light">
              Goa Luxury & Cadastral Intelligence
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-alabaster font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Supabase Auth Protected</span>
        </div>
      </header>

      {/* Main Landing & Authentication Gateway */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Hero Presentation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 text-coral text-xs font-bold uppercase tracking-wider border border-coral/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified High-Value Property Portal</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Where Goa Ancestral Estates Meet <span className="text-coral">AI Intelligence</span>
            </h1>

            <p className="text-alabaster text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Sign in to access verified Form I & XIV title pre-audits, Google Maps BhuNaksha cadastral boundary overlays, instant AVM comps, and direct WhatsApp buyer bids.
            </p>

            {/* 3 Pillar Features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-coral/20 text-coral flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Title Vault Pre-Screening</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Pre-screens Form I & XIV and Form D land records to resolve missing title links and tenant encumbrances.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-coral/20 text-coral flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">BhuNaksha Cadastral Overlays</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Pinpoint locations and overlay official Goa cadastral survey parcel boundaries directly over Google Maps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-coral/20 text-coral flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Automated Valuation & WhatsApp Bids</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Instant micro-market comp pricing with automated WhatsApp notifications for incoming buyer cash offers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Supabase Authentication Form Box */}
          <div className="lg:col-span-6">
            <div className="bg-white text-prussian rounded-3xl p-6 sm:p-8 shadow-2xl border border-alabaster">
              
              {/* Card Header & Toggle */}
              <div className="mb-6">
                <div className="flex rounded-xl bg-alabaster-100 p-1 mb-5 border border-alabaster">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(''); setInfoMessage(''); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      !isSignUp 
                        ? 'bg-[#102542] text-white shadow' 
                        : 'text-gray-600 hover:text-prussian'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(''); setInfoMessage(''); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      isSignUp 
                        ? 'bg-coral text-white shadow-coral-glow' 
                        : 'text-gray-600 hover:text-coral'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <h2 className="font-serif text-2xl font-bold text-prussian">
                  {isSignUp ? 'Register with Supabase Auth' : 'Sign In to Your Workspace'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {isSignUp 
                    ? 'Enter your credentials to create a secure account linked to Supabase.' 
                    : 'Enter your registered email and password to access KSHETRAM services.'}
                </p>
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Informational / Success Message */}
              {infoMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {isSignUp && (
                  <>
                    {/* User Persona / Role Selection */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-prussian mb-1.5">
                        Register As <span className="text-coral">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'buyer', label: 'Buyer', desc: 'Looking to acquire' },
                          { id: 'seller', label: 'Seller', desc: 'Listing property' },
                          { id: 'broker', label: 'Broker', desc: 'Real estate agent' },
                          { id: 'rent', label: 'Rent', desc: 'Tenant search' }
                        ].map(r => (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              role === r.id
                                ? 'border-coral bg-coral-50 text-coral-900 shadow-sm'
                                : 'border-alabaster bg-alabaster-50/50 text-gray-700 hover:border-coral/50'
                            }`}
                          >
                            <div className="text-xs font-bold uppercase">{r.label}</div>
                            <div className="text-[9px] text-gray-500 mt-0.5">{r.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Armando"
                            required
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/40"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="De Sequeira"
                          className="w-full px-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/40"
                        />
                      </div>
                    </div>

                    {/* Phone Number for WhatsApp Alerts */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number (For WhatsApp Offer Notifications) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98221 44552"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/40"
                        />
                      </div>
                    </div>

                    {/* Optional Company Details for Seller or Broker */}
                    {(role === 'seller' || role === 'broker') && (
                      <div className="p-3.5 rounded-xl bg-alabaster-50 border border-alabaster space-y-2.5">
                        <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-prussian">
                          <Building2 className="w-3.5 h-3.5 text-coral" />
                          <span>Agency / Company Details (Optional)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Heritage Estates Goa"
                            className="w-full px-3 py-1.5 rounded-lg border border-alabaster bg-white text-xs focus:outline-none focus:border-coral"
                          />
                          <input
                            type="url"
                            value={companyLogoUrl}
                            onChange={(e) => setCompanyLogoUrl(e.target.value)}
                            placeholder="Logo URL"
                            className="w-full px-3 py-1.5 rounded-lg border border-alabaster bg-white text-xs focus:outline-none focus:border-coral"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/40"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password {isSignUp && <span className="text-gray-400 font-normal">(min. 6 characters)</span>} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <span>
                    {loading 
                      ? 'Authenticating with Supabase...' 
                      : (isSignUp ? 'Create Supabase Account & Enter' : 'Sign In to Dashboard')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

              {/* Security Footnote */}
              <div className="mt-5 pt-4 border-t border-alabaster flex items-center justify-center space-x-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Supabase PostgreSQL Auth & Row-Level Security</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-400">
        © 2026 KSHETRAM (क्षेत्रम्) • Goa Luxury Real Estate, BhuNaksha Cadastre & RAG Intelligence
      </footer>

    </div>
  );
}

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MapsPage from './pages/MapsPage';
import InvestorPortalPage from './pages/InvestorPortalPage';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';
import PropertyDetailModal from './components/PropertyDetailModal';

function AppContent() {
  const { user, initialLoading, skipVerification } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Loading Session Verification State (Only shown for max ~1s if a stored session exists in localStorage)
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#102542] flex flex-col items-center justify-center text-white space-y-4 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center text-white font-serif font-bold text-3xl shadow-coral-glow animate-pulse">
          क्ष
        </div>
        <div className="text-center space-y-1">
          <div className="font-serif text-2xl font-bold tracking-wider">KSHETRAM</div>
          <div className="text-xs text-gray-400 font-mono tracking-widest uppercase">
            Restoring Supabase Security Session...
          </div>
        </div>
        <button
          type="button"
          onClick={skipVerification}
          className="mt-4 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-alabaster-300 hover:text-white text-xs transition-all border border-white/10"
        >
          Continue to Sign In →
        </button>
      </div>
    );
  }

  // If Not Authenticated -> The Landing Page IS Login & Sign Up (No Dashboard Access!)
  if (!user) {
    return <AuthPage onAuthenticated={() => setActiveTab('home')} />;
  }

  // Once Authenticated via Supabase -> Full Application Dashboard & Services
  return (
    <div className="min-h-screen bg-alabaster-50 font-sans selection:bg-coral selection:text-white relative">
      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area Offset for Left Sidebar on Desktop */}
      <div className="md:pl-72 min-h-screen flex flex-col transition-all">
        <main className="flex-1">
          {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} />}
          {activeTab === 'chatbot' && <ChatbotPage setActiveTab={setActiveTab} />}
          {activeTab === 'explore' && <ExplorePage setActiveTab={setActiveTab} />}
          {activeTab === 'maps' && <MapsPage setActiveTab={setActiveTab} />}
          {activeTab === 'investor' && <InvestorPortalPage setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <ProfilePage setActiveTab={setActiveTab} />}
          {activeTab === 'welcome' && <WelcomePage setActiveTab={setActiveTab} />}
        </main>

        {/* Global Expanded Property Modal */}
        <PropertyDetailModal />

        {/* Clean Luxury Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AppContent />
      </PropertyProvider>
    </AuthProvider>
  );
}


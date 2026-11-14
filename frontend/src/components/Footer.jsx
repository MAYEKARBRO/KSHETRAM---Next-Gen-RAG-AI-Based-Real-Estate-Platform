import React from 'react';
import { ShieldCheck, MapPin, ExternalLink, Sparkles, Phone, Mail } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-[#102542] text-alabaster border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center font-serif text-white font-bold text-xl shadow-coral-glow">
                क्ष
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-wider">
                KSHETRAM
              </span>
            </div>
            <p className="text-sm text-alabaster-300 leading-relaxed mb-4">
              India's premier AI and RAG driven real estate platform for high-value ancestral estates, coastal villas, and verified cadastral land in Goa.
            </p>
            <div className="flex items-center space-x-2 text-xs text-khaki">
              <ShieldCheck className="w-4 h-4 text-coral" />
              <span>Form I & XIV + DSLR BhuNaksha Cross-Audited</span>
            </div>
          </div>

          {/* Column 2: Key Portals & Micro-Markets */}
          <div>
            <h4 className="font-serif text-white text-base font-bold mb-4 tracking-wider uppercase">
              Goa Micro-Markets
            </h4>
            <ul className="space-y-2.5 text-sm text-alabaster-300">
              {['Assagao (Heritage Boulevard)', 'Anjuna (Coastal Sanctuary)', 'Siolim (Riverfront Corridors)', 'Aldona (Ancestral Quintas)', 'Vagator (Boutique Hospitality)', 'Morjim (Mopa Airport Growth)'].map((market) => (
                <li key={market}>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="hover:text-coral transition-colors flex items-center space-x-1.5"
                  >
                    <span className="text-coral">›</span>
                    <span>{market}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Proprietary AI Technologies */}
          <div>
            <h4 className="font-serif text-white text-base font-bold mb-4 tracking-wider uppercase">
              AI & Governance Engine
            </h4>
            <ul className="space-y-2.5 text-sm text-alabaster-300">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-coral transition-colors">
                  Natural Language Voice Search
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-coral transition-colors">
                  Instant Hyper-Local Comp AVM
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-coral transition-colors">
                  Document Vault Form I & XIV Pre-Audit
                </button>
              </li>
              <li>
                <a 
                  href="https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-coral transition-colors flex items-center space-x-1"
                >
                  <span>Goa DSLR BhuNaksha Portal</span>
                  <ExternalLink className="w-3 h-3 text-coral" />
                </a>
              </li>
              <li>
                <button onClick={() => setActiveTab('investor')} className="hover:text-coral transition-colors">
                  Institutional Yield Matrix (60% LTV)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Private Concierge */}
          <div>
            <h4 className="font-serif text-white text-base font-bold mb-4 tracking-wider uppercase">
              Private Concierge
            </h4>
            <p className="text-sm text-alabaster-300 mb-4">
              Direct institutional acquisition advisory and Portuguese title due diligence.
            </p>
            <div className="space-y-2 text-sm text-alabaster-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-coral" />
                <span>concierge@kshetram.luxury</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-coral" />
                <span>+91 (832) 249-KSHETRAM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-alabaster-400">
          <p>© {new Date().getFullYear()} KSHETRAM Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span>RERA Registered & Title Audited</span>
            <span>Right to be Forgotten Compliant</span>
            <span className="text-khaki">Prussian & Coral Luxury Edition</span>
          </div>
        </div>

      </div>
    </footer>
  );
}


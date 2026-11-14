import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, Sparkles, Check, ArrowRight, Volume2 } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

export default function VoiceSearch({ onResultSelect }) {
  const { setActiveFilters, filteredProperties, setSelectedPropertyForModal } = useProperty();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedIntent, setParsedIntent] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const sampleVoicePrompts = [
    "Find heritage villas in Assagao with verified titles under ₹7 Cr",
    "Show me coastal pool residences in Anjuna under ₹5.5 Cr",
    "Riverfront luxury villa in Siolim with high cash on cash return",
    "Ancestral Portuguese Quinta in Aldona with clean Form I & XIV"
  ];

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const parseQueryText = (queryText) => {
    const qLower = queryText.toLowerCase();
    
    // 1. Location
    const microMarkets = ['Assagao', 'Anjuna', 'Vagator', 'Siolim', 'Aldona', 'Porvorim', 'Morjim', 'Candolim'];
    let detectedLocation = 'All Locations';
    for (const mm of microMarkets) {
      if (qLower.includes(mm.toLowerCase())) {
        detectedLocation = mm;
        break;
      }
    }

    // 2. Property Type
    let detectedType = 'all';
    if (qLower.includes('villa') || qLower.includes('heritage') || qLower.includes('quinta') || qLower.includes('estate')) {
      detectedType = 'villa';
    } else if (qLower.includes('plot') || qLower.includes('land')) {
      detectedType = 'land';
    } else if (qLower.includes('apartment') || qLower.includes('flat')) {
      detectedType = 'apartment';
    }

    // 3. Price
    let maxPrice = 150000000;
    const crMatch = qLower.match(/(?:under|below|budget of)?\s*(?:₹|rs\.?)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:cr|crore)/i);
    if (crMatch) {
      maxPrice = parseFloat(crMatch[1]) * 10000000;
    } else {
      const lakhMatch = qLower.match(/(?:under|below)?\s*(?:₹|rs\.?)?\s*([0-9]+)\s*(?:lakh|lakhs|l)/i);
      if (lakhMatch) {
        maxPrice = parseFloat(lakhMatch[1]) * 100000;
      }
    }

    // 4. Verified Title
    const verifiedOnly = qLower.includes('verified') || qLower.includes('title') || qLower.includes('form i & xiv') || qLower.includes('audit');

    const parsed = {
      rawQuery: queryText,
      microMarket: detectedLocation,
      propertyType: detectedType,
      maxPrice,
      verifiedOnly,
      detectedAmenities: qLower.includes('pool') ? ['Private Pool'] : []
    };

    setParsedIntent(parsed);

    // Apply to global search filter
    setActiveFilters(prev => ({
      ...prev,
      microMarket: detectedLocation,
      propertyType: detectedType,
      maxPrice,
      verifiedOnly,
      query: ''
    }));
  };

  const startListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. You can type or click the prompt chips below.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          parseQueryText(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to initialize:', err);
      setIsListening(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setTranscript(prompt);
    parseQueryText(prompt);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-alabaster shadow-luxury">
      
      {/* Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-alabaster gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
              01
            </span>
            <h3 className="font-serif text-2xl font-bold text-prussian">
              AI Voice & Natural Language Search
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Speak directly or enter your search naturally. The RAG pipeline resolves micro-markets, titles, and budget limits instantly.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-coral bg-coral-50 px-3 py-1 rounded-full border border-coral-200">
            Natural Voice Recognition
          </span>
        </div>
      </div>

      {/* Mic Trigger & Text Input Bar */}
      <div className="relative flex items-center mb-6">
        <input
          type="text"
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (e.target.value.length > 5) {
              parseQueryText(e.target.value);
            }
          }}
          placeholder="Speak or type: 'Find heritage villas in Assagao with verified titles under ₹7 Cr'..."
          className="w-full pl-5 pr-28 py-4 rounded-xl border-2 border-alabaster-200 focus:outline-none focus:border-coral text-sm sm:text-base text-prussian bg-alabaster-50/50 shadow-inner"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            onClick={startListening}
            className={`p-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-red-200'
                : 'bg-coral hover:bg-coral-600 text-white shadow-coral-glow'
            }`}
            title="Click to speak"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="hidden sm:inline">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Speak</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Voice Prompts */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-prussian-700 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span>Quick Natural Voice Scenarios:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleVoicePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-left text-xs p-3 rounded-xl bg-alabaster-50 hover:bg-coral-50/60 border border-alabaster hover:border-coral/40 text-gray-700 transition-all flex items-start space-x-2 group"
            >
              <Volume2 className="w-3.5 h-3.5 text-coral mt-0.5 flex-shrink-0 group-hover:scale-110" />
              <span className="italic leading-relaxed font-sans">{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Intent Display & Matching Estates */}
      {parsedIntent && (
        <div className="p-5 rounded-xl bg-[#102542] text-white border border-coral/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-alabaster">
                Parsed Search Parameters
              </span>
            </div>
            <span className="text-xs font-mono text-coral font-bold">
              {filteredProperties.length} Properties Matched
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              Micro-Market: <strong className="text-coral">{parsedIntent.microMarket}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              Property: <strong className="text-white capitalize">{parsedIntent.propertyType}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              Max Budget: <strong className="text-emerald-300">₹{(parsedIntent.maxPrice / 10000000).toFixed(2)} Cr</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              Title Status: <strong className={parsedIntent.verifiedOnly ? "text-emerald-400" : "text-alabaster"}>
                {parsedIntent.verifiedOnly ? "Verified RoR Only" : "All Titles"}
              </strong>
            </span>
          </div>

          {/* Quick Matches Preview Cards */}
          {filteredProperties.length > 0 ? (
            <div className="pt-2">
              <p className="text-xs text-alabaster-400 mb-2">Direct Matched Listings (Click to inspect):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProperties.slice(0, 3).map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedPropertyForModal(prop)}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center space-x-3"
                  >
                    <img 
                      src={prop.featured_image || prop.photos?.[0]} 
                      alt={prop.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{prop.title}</h4>
                      <p className="text-[11px] text-alabaster-400">{prop.micro_market} • {prop.built_up_sqft} sqft</p>
                      <p className="text-xs font-bold text-coral">₹{(prop.price / 10000000).toFixed(2)} Cr</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-alabaster-400">
              No direct matches for this specific combination. Try broadening your budget or micro-market.
            </div>
          )}
        </div>
      )}

    </div>
  );
}


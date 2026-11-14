import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Key, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  MessageSquare, 
  Compass, 
  TrendingUp, 
  Scale, 
  AlertCircle,
  X
} from 'lucide-react';
import { 
  askKshetramChatbot, 
  getGeminiApiKey, 
  setGeminiApiKey 
} from '../lib/geminiChatService';
import { useAuth } from '../context/AuthContext';

export default function ChatbotPage({ setActiveTab }) {
  const { user } = useAuth();
  
  const [apiKey, setApiKey] = useState(() => getGeminiApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [keySavedToast, setKeySavedToast] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Namaskar! I am KSHETRAM AI (क्षेत्रम्)

I specialize in **Goa Land Law, Cadastral Maps (BhuNaksha), Ancestral Title Due Diligence, and Real Estate Valuation**.

You can ask me questions about:
* **Portuguese Civil Code 1867**: *Comunhão de Bens*, *Inventário* court proceedings, and legal heir conveyance requirements.
* **Form I & XIV & BhuNaksha**: Survey numbers, subdivision boundaries, tenant/mundkar column checks.
* **Land Zoning & Sanad**: Section 32 conversion of agricultural/orchard land to settlement zone.
* **Coastal Regulation Zone (CRZ)**: CRZ-III No Development Zone (NDZ) norms for beachfront villas.
* **Valuation & Investment**: Cap rates, rental yields in Assagao, Siolim, Vagator, and Mopa Airport corridors.

*Click any prompt chip below to begin, or type your question!*`,
      source: apiKey ? 'Google Gemini 1.5 Flash' : 'KSHETRAM Goa Land Knowledge Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const promptChips = [
    { label: '📜 Portuguese Succession', query: 'How does Portuguese Civil Code (Inventário) affect ancestral property titles in Goa?' },
    { label: '🗺️ Verify Form I & XIV', query: 'What is the step-by-step process to verify Form I & XIV on BhuNaksha for a Goa land plot?' },
    { label: '🏗️ Sanad Land Conversion', query: 'What is a Sanad conversion and can orchard land be converted to settlement in Goa?' },
    { label: '🌊 CRZ-III Beachfront Norms', query: 'What are the CRZ-III regulations for buying or building a beachfront villa in North Goa?' },
    { label: '🛡️ Mundkar & Tenant Rights', query: 'How do I check if there are Mundkars or tenants on a property and what are the legal risks?' },
    { label: '📊 Yields: Assagao vs Siolim', query: 'What are typical capital values, gross rental yields, and cap rates in Assagao vs Siolim?' },
    { label: '📋 30-Year Title Checklist', query: 'What documents are required for complete 30-year title due diligence before buying land in Goa?' }
  ];

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await askKshetramChatbot({
        messages: newMessages.filter(m => m.id !== 'welcome'),
        apiKey: apiKey
      });

      const assistantMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        source: response.source,
        isLiveGemini: response.isLiveGemini,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ An error occurred while retrieving answer: ${err.message}. Please try again.`,
          source: 'System Error Handler',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(tempKeyInput);
    setApiKey(tempKeyInput.trim());
    setShowKeyModal(false);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 4000);
  };

  const handleClearApiKey = () => {
    setGeminiApiKey('');
    setApiKey('');
    setTempKeyInput('');
    setShowKeyModal(false);
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    if (window.confirm('Reset this conversation?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="min-h-screen bg-alabaster-50 flex flex-col justify-between">
      
      {/* Top Banner & Header */}
      <div className="bg-[#102542] text-white border-b border-coral/20 px-4 sm:px-8 py-5 shadow-luxury">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-coral-600 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-coral-glow flex-shrink-0">
              क्ष
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
                  KSHETRAM AI Land & Legal Advisor
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-coral/20 text-coral text-[10px] font-bold border border-coral/30">
                  RAG Intelligence
                </span>
              </div>
              <p className="text-xs text-alabaster font-light mt-0.5">
                Authoritative Goa Cadastral, Portuguese Succession, Zoning & Valuation Legal Advisor
              </p>
            </div>
          </div>

          {/* Gemini API Key Indicator & Configuration Button */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => {
                setTempKeyInput(apiKey);
                setShowKeyModal(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2 ${
                apiKey
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-white/10 text-alabaster border-white/15 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-400' : 'text-coral'}`} />
              <span>{apiKey ? 'Gemini 1.5 Connected' : 'Configure Gemini Key'}</span>
            </button>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        
        {/* API Key Status Notice */}
        {!apiKey && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between text-xs shadow-sm">
            <div className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Operating on KSHETRAM Built-in Goa Legal Knowledge Base.</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Answers to Goa land laws, Form I & XIV, BhuNaksha, and Portuguese succession are active. You can add your <strong>Google Gemini API key</strong> anytime for unbounded live AI conversation.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTempKeyInput(apiKey);
                setShowKeyModal(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex-shrink-0 ml-3 transition-colors"
            >
              Add Key
            </button>
          </div>
        )}

        {/* Suggested Quick Question Chips */}
        <div className="mb-4">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 flex items-center space-x-1">
            <HelpCircle className="w-3 h-3 text-coral" />
            <span>Recommended Real Estate & Land Law Inquiries:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-coral/10 hover:border-coral/40 text-prussian border border-alabaster text-xs font-medium transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 bg-white rounded-3xl border border-alabaster shadow-luxury p-4 sm:p-6 overflow-y-auto space-y-5 min-h-[420px] max-h-[62vh]">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id || index}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-prussian text-white'
                    : 'bg-gradient-to-br from-coral to-coral-600 text-white shadow-coral-glow font-serif'
                }`}>
                  {isUser ? (user?.first_name?.[0]?.toUpperCase() || 'U') : 'क्ष'}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#102542] text-white rounded-tr-none shadow-md'
                    : 'bg-alabaster-50/80 text-prussian border border-alabaster rounded-tl-none shadow-sm'
                }`}>
                  
                  {/* Assistant Message Header */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-alabaster/80 pb-2 mb-2.5 text-[11px] text-gray-500">
                      <div className="flex items-center space-x-1.5 font-bold text-prussian">
                        <Bot className="w-3.5 h-3.5 text-coral" />
                        <span>KSHETRAM Legal Intelligence</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {msg.source || 'Domain Engine'}
                      </span>
                    </div>
                  )}

                  {/* Message Content Body (Supports Markdown formatting) */}
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm space-y-2">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      // Check for markdown headings
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="font-serif font-bold text-base text-prussian mt-2 mb-1">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h4 key={pIdx} className="font-serif font-bold text-sm text-coral mt-2 mb-0.5">
                            {paragraph.replace('#### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('> ')) {
                        return (
                          <blockquote key={pIdx} className="p-2.5 rounded-lg bg-amber-50/80 border-l-4 border-amber-500 text-xs text-amber-900 my-2 italic">
                            {paragraph.replace('> ', '')}
                          </blockquote>
                        );
                      }
                      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n');
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1 text-xs">
                            {items.map((item, iIdx) => (
                              <li key={iIdx}>
                                {item.replace(/^[\*\-]\s+/, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (/^\d+\.\s/.test(paragraph)) {
                        const items = paragraph.split('\n');
                        return (
                          <ol key={pIdx} className="list-decimal pl-4 space-y-1 text-xs">
                            {items.map((item, iIdx) => (
                              <li key={iIdx}>
                                {item.replace(/^\d+\.\s+/, '')}
                              </li>
                            ))}
                          </ol>
                        );
                      }

                      return (
                        <p key={pIdx} className={isUser ? 'text-white' : 'text-gray-700'}>
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Assistant Footer: Copy button & timestamp */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-alabaster/60 text-[10px] text-gray-400">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyText(msg.content, index)}
                        className="flex items-center space-x-1 hover:text-coral transition-colors px-2 py-0.5 rounded hover:bg-white"
                        title="Copy answer to clipboard"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-right text-[10px] text-gray-400 mt-1.5">
                      {msg.timestamp}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral to-coral-600 text-white font-serif font-bold text-xs flex items-center justify-center shadow-coral-glow">
                क्ष
              </div>
              <div className="p-3.5 rounded-2xl bg-alabaster-50 border border-alabaster rounded-tl-none flex items-center space-x-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-coral animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-coral animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-coral animate-bounce delay-300"></span>
                <span className="text-[11px] font-mono ml-2">
                  Analyzing Portuguese Civil Code, Form I & XIV & Cadastre...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Actions */}
        <div className="mt-4 bg-white p-3 rounded-2xl border border-alabaster shadow-luxury">
          <div className="flex items-center space-x-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Goa land, titles, BhuNaksha, zoning, or investments... (Enter to send)"
              className="flex-1 resize-none py-2 px-3 text-xs sm:text-sm text-prussian focus:outline-none placeholder-gray-400 bg-transparent max-h-32"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || loading}
              className="p-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold transition-all shadow-coral-glow disabled:opacity-40 disabled:hover:bg-coral flex-shrink-0"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 px-1 border-t border-alabaster/60 mt-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-gray-600">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-gray-600">Shift + Enter</kbd> for newline</span>
            <span className="hidden sm:inline">Goa Land Revenue Code 1968 & Portuguese Civil Code 1867 Integrated</span>
          </div>
        </div>

      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-prussian-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-alabaster p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-alabaster">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-prussian">
                    Configure Google Gemini API Key
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Connect Gemini 1.5 Flash / Pro for unbounded live intelligence
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-prussian block mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-alabaster text-xs focus:outline-none focus:border-coral bg-alabaster-50/50 font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Stored securely in your local browser storage. Never transmitted to third-party backends.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>How to get a free Gemini API key:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold text-blue-700">Google AI Studio (aistudio.google.com)</a>
                  <br />
                  2. Click <strong>"Create API Key"</strong> and copy it here.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove Saved Key
                  </button>
                ) : <span />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl border border-alabaster text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-bold shadow-coral-glow transition-all"
                  >
                    Save API Key
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {keySavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-luxury flex items-center space-x-2 text-xs border border-emerald-500/40 animate-slide-up">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gemini API Key successfully updated! Active for all chats.</span>
        </div>
      )}

    </div>
  );
}

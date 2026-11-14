import React, { useState } from 'react';
import { auditVaultDocument } from '../lib/api';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink,
  HelpCircle,
  FileSearch
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    id: 'clean-assagao',
    name: 'Form I & XIV - Clean Heritage Title (Assagao 142/6)',
    claimedSeller: 'Armando De Sequeira',
    surveyNo: '142',
    subdivisionNo: '6',
    text: `GOVERNMENT OF GOA - DIRECTORATE OF SETTLEMENT AND LAND RECORDS
FORM I & XIV (RECORD OF RIGHTS)
District: North Goa | Taluka: Bardez | Village: Assagao | Survey No: 142 | Sub-div: 6
Total Area: 0-12-50 (1,250 Sq. Mtrs)
Class of Land: Bagayat / Settlement Garden Zone A2

COLUMN 2 - NAME OF OCCUPANT / KHATEDAR:
1. Shri Armando De Sequeira (Registered Owner via Deed of Succession Reg. No. 452/1998, Sub-Registrar Mapusa)

COLUMN 3 - NATURE OF RIGHT: Sole Occupant / Absolute Ownership

COLUMN 5 - NAME OF TENANT (MUNDKAR): NIL
COLUMN 6 - OTHER RIGHTS AND CHARGES: NIL. No Bank Mortgage, No Charge.

REMARKS & MUTATION NOTES: Mutation Entry No. 891 approved by Mamlatdar of Bardez dated 14/08/2004 pursuant to registered partition.`
  },
  {
    id: 'flagged-anjuna',
    name: 'Form I & XIV - Tenancy & Succession Dispute (Anjuna 88/3-A)',
    claimedSeller: 'Vikas Sharma',
    surveyNo: '88',
    subdivisionNo: '3-A',
    text: `GOVERNMENT OF GOA - DIRECTORATE OF SETTLEMENT AND LAND RECORDS
FORM I & XIV (RECORD OF RIGHTS)
District: North Goa | Taluka: Bardez | Village: Anjuna | Survey No: 88 | Sub-div: 3-A
Total Area: 0-24-00 (2,400 Sq. Mtrs)

COLUMN 2 - NAME OF OCCUPANT:
1. Late Domingos Xavier Pinto (Deceased - Succession pending before Civil Court)
2. Unregistered co-heirs of Late Pinto

COLUMN 5 - NAME OF TENANT:
1. Shri Raghuvir Gaonkar - Agricultural Tenant / Mundkar registered under Goa Mundkar Act 1975

COLUMN 6 - OTHER RIGHTS AND CHARGES:
Bank Hypothecation in favour of Goa State Co-op Bank Ltd for ₹25,00,000/- dated 12/03/2018. Stay order petition pending in Civil Court Junior Division Mapusa Reg. Suit No. 44/2022.`
  }
];

export default function DocumentVaultAudit() {
  const [selectedPreset, setSelectedPreset] = useState('clean-assagao');
  const [documentText, setDocumentText] = useState(PRESET_SAMPLES[0].text);
  const [claimedSeller, setClaimedSeller] = useState(PRESET_SAMPLES[0].claimedSeller);
  const [surveyNo, setSurveyNo] = useState(PRESET_SAMPLES[0].surveyNo);
  const [subdivisionNo, setSubdivisionNo] = useState(PRESET_SAMPLES[0].subdivisionNo);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PRESET_SAMPLES.find(p => p.id === presetId);
    if (preset) {
      setDocumentText(preset.text);
      setClaimedSeller(preset.claimedSeller);
      setSurveyNo(preset.surveyNo);
      setSubdivisionNo(preset.subdivisionNo);
      setAuditResult(null);
    }
  };

  const handleRunAudit = async () => {
    setLoading(true);
    const result = await auditVaultDocument({
      documentText,
      documentType: 'Form I & XIV',
      claimedSeller,
      surveyNo,
      subdivisionNo
    });

    if (result) {
      setAuditResult(result);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-alabaster shadow-luxury">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-alabaster gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-[#102542] text-coral flex items-center justify-center font-bold text-sm">
              03
            </span>
            <h3 className="font-serif text-2xl font-bold text-prussian">
              Document Vault Pre-Audit
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pre-screens Form I & XIV (Goa RoR) and Form D mutations to detect missing title links, mundkar disputes, and succession gaps before listing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Legal Due Diligence</span>
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="mb-6 p-4 rounded-xl bg-alabaster-50 border border-alabaster">
        <div className="text-xs font-bold uppercase tracking-wider text-prussian mb-2 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span>Select Real-World Goa Land Record Scenario:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_SAMPLES.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === preset.id
                  ? 'bg-white border-coral shadow-sm text-prussian font-semibold'
                  : 'bg-white/60 border-alabaster text-gray-600 hover:border-coral/40'
              }`}
            >
              <div className="text-xs font-bold">{preset.name}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Vendor: {preset.claimedSeller} • Survey: {preset.surveyNo}/{preset.subdivisionNo}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Document Text Input Column */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Claimed Seller</label>
              <input
                type="text"
                value={claimedSeller}
                onChange={(e) => setClaimedSeller(e.target.value)}
                placeholder="Vendor Name"
                className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs focus:outline-none focus:border-coral"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Survey No</label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="142"
                className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs focus:outline-none focus:border-coral font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sub-div No</label>
              <input
                type="text"
                value={subdivisionNo}
                onChange={(e) => setSubdivisionNo(e.target.value)}
                placeholder="6"
                className="w-full px-3 py-2 rounded-lg border border-alabaster text-xs focus:outline-none focus:border-coral font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-prussian mb-1">
              Land Record Text (Form I & XIV / Form D Extract)
            </label>
            <textarea
              rows={12}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-alabaster text-xs font-mono bg-alabaster-50/50 text-prussian focus:outline-none focus:border-coral leading-relaxed resize-none"
              placeholder="Paste text from Form I & XIV or Form D mutation extract..."
            />
          </div>

          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center justify-center space-x-2"
          >
            <FileSearch className="w-4 h-4" />
            <span>{loading ? 'Analyzing Legal Chains & Mundkar Records...' : 'Execute Pre-Audit AI Scan'}</span>
          </button>

        </div>

        {/* Audit Results Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {auditResult ? (
            <div className="space-y-4">
              
              {/* Score Meter Banner */}
              <div className={`p-6 rounded-2xl border text-white shadow-luxury ${
                auditResult.auditScore >= 80 
                  ? 'bg-gradient-to-br from-[#102542] to-emerald-950 border-emerald-500/40' 
                  : 'bg-gradient-to-br from-[#102542] to-red-950 border-red-500/40'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-alabaster">
                    Title Health Score
                  </span>
                  <span className="text-[11px] font-mono text-alabaster-400">
                    Engine: {auditResult.engine || 'RAG Pre-Audit'}
                  </span>
                </div>

                <div className="my-4 flex items-center justify-between">
                  <div>
                    <div className="font-serif text-5xl font-black text-white">
                      {auditResult.auditScore}<span className="text-2xl text-alabaster-400">/100</span>
                    </div>
                    <p className="text-sm font-bold text-coral mt-1">
                      {auditResult.encumbranceStatus}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-alabaster-300">Cadastral Ref:</div>
                    <div className="text-sm font-mono font-bold text-white">
                      {auditResult.taluka} • Survey {auditResult.surveyNo}/{auditResult.subdivisionNo}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      auditResult.auditScore >= 80 ? 'bg-emerald-400' : 'bg-coral'
                    }`}
                    style={{ width: `${auditResult.auditScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Flagged Issues */}
              {auditResult.flaggedIssues?.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-red-900 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Identified Title Gaps & Encumbrances ({auditResult.flaggedIssues.length}):</span>
                  </div>
                  {auditResult.flaggedIssues.map((issue, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-red-100 text-xs">
                      <div className="font-bold text-red-800">
                        {typeof issue === 'object' ? issue.title : issue}
                      </div>
                      {typeof issue === 'object' && (
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                          {issue.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Positive Highlights */}
              {auditResult.positiveHighlights?.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Clear Columns:</span>
                  </div>
                  {auditResult.positiveHighlights.map((pos, idx) => (
                    <p key={idx} className="text-xs text-emerald-800 flex items-center space-x-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{pos}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Actionable Resolution Roadmap */}
              {auditResult.resolutionRoadmap?.length > 0 && (
                <div className="p-4 rounded-xl bg-alabaster-50 border border-alabaster space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-prussian">
                    Step-by-Step Title Cure Roadmap
                  </h4>
                  <div className="space-y-2">
                    {auditResult.resolutionRoadmap.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-alabaster text-xs flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#102542] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {step.step || idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-prussian">{step.title}</div>
                          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-alabaster-300 text-center bg-alabaster-50/50 min-h-[360px]">
              <div className="w-14 h-14 rounded-2xl bg-[#102542]/5 text-coral flex items-center justify-center mb-3">
                <FileSearch className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-prussian">
                Ready for AI Land Pre-Audit
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                Click "Execute Pre-Audit AI Scan" to run the NLP verification engine on the selected land record text.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}


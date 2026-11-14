import { auditLandRecordText } from '../services/landRecordParser.js';
import { supabase, isSupabaseConfigured } from '../supabaseAdmin.js';

const SAMPLE_LAND_RECORDS = [
  {
    id: 'sample-clean-assagao',
    name: 'Form I & XIV - Survey 142/6 Assagao (Clean Heritage Estate Title)',
    documentType: 'Form I & XIV',
    claimedSeller: 'Armando De Sequeira',
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
    id: 'sample-flagged-anjuna',
    name: 'Form I & XIV - Survey 88/3-A Anjuna (Flagged: Tenancy & Succession Dispute)',
    documentType: 'Form I & XIV',
    claimedSeller: 'Vikas Sharma',
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

export async function auditDocument(req, res) {
  try {
    const { documentText, documentType, claimedSeller, surveyNo, subdivisionNo, userId } = req.body;

    if (!documentText) {
      return res.status(400).json({ success: false, message: 'Document text is required for pre-audit.' });
    }

    // Check if Google Colab external RAG API is available
    const colabUrl = process.env.COLAB_RAG_API_URL;
    let auditResult = null;

    if (colabUrl) {
      try {
        console.log(`📡 Forwarding audit to external Colab RAG at ${colabUrl}...`);
        const response = await fetch(`${colabUrl.replace(/\/$/, '')}/api/vault-pre-audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_text: documentText,
            document_type: documentType || 'Form I & XIV',
            claimed_seller: claimedSeller || '',
            survey_no: surveyNo || '',
            subdivision_no: subdivisionNo || ''
          }),
          signal: AbortSignal.timeout(4000)
        });

        if (response.ok) {
          const colabData = await response.json();
          auditResult = {
            ...colabData,
            engine: 'Google Colab RAG External'
          };
        }
      } catch (colabErr) {
        console.warn('Colab RAG endpoint unreachable, falling back to internal audit parser:', colabErr.message);
      }
    }

    if (!auditResult) {
      auditResult = auditLandRecordText({
        documentText,
        documentType,
        claimedSeller,
        surveyNo,
        subdivisionNo
      });
      auditResult.engine = 'Kshetram Embedded Land Records Parser';
    }

    // Save audit log to Supabase if configured
    if (isSupabaseConfigured && userId) {
      await supabase.from('document_vault_audits').insert([{
        user_id: userId,
        document_type: documentType || 'Form I & XIV',
        survey_no: auditResult.surveyNo,
        subdivision_no: auditResult.subdivisionNo,
        taluka: auditResult.taluka,
        village: auditResult.village,
        encumbrance_status: auditResult.encumbranceStatus,
        audit_score: auditResult.auditScore,
        extracted_metadata: auditResult,
        recommendations: auditResult.resolutionRoadmap.map(r => r.action)
      }]);
    }

    return res.json({ success: true, audit: auditResult });
  } catch (error) {
    console.error('Error in auditDocument:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export function getSampleRecords(req, res) {
  return res.json({ success: true, samples: SAMPLE_LAND_RECORDS });
}


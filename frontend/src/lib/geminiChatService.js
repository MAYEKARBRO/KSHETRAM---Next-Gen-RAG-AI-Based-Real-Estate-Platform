/**
 * KSHETRAM AI CHATBOT SERVICE
 * Connects with Google Gemini API (gemini-3.5-flashilite)
 * Fallback to KSHETRAM Institutional Goa Land & Real Estate Knowledge Base
 */

export const GEMINI_STORAGE_KEY = 'kshetram_gemini_api_key';

/**
 * Get active Gemini API key from localStorage or Vite environment variables
 */
export function getGeminiApiKey() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(GEMINI_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Save custom Gemini API key into localStorage
 */
export function setGeminiApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY);
    }
  }
}

/**
 * System prompt setting the Persona and Domain Knowledge boundaries
 */
const SYSTEM_INSTRUCTION = `You are KSHETRAM AI (क्षेत्रम्), an elite institutional real estate, land legal advisor, and cadastral intelligence consultant specializing in Goa and Indian luxury property markets.

Your areas of expertise:
1. Portuguese Civil Code 1867 & Goa Succession Law:
   - "Comunhão de Bens" (Universal Community of Property): Matrimonial regime where spouses hold equal undivided half-share.
   - "Inventário" proceedings (Court inventory proceedings for ancestral property division).
   - Necessity of all co-heirs and descendants signing the conveyance deed.
   - Risks of unregistered Wills, Power of Attorney abuse, and missing legal heir consents.
2. Goa Land Records & BhuNaksha:
   - Form I & XIV (Record of Rights): Land title, occupant name, nature of possession.
   - Survey numbers and subdivision numbers; detecting sub-divisions without physical access.
   - BhuNaksha cadastral maps (Directorate of Settlement & Land Records Goa, dslr.goa.gov.in).
   - Form D (City Survey Property Card for urban areas like Panaji, Margao, Mapusa, Vasco).
   - Mutation extracts (Form I & XIV mutation entries).
3. Land Conversions & Zoning:
   - Section 32 of the Goa Land Revenue Code 1968: Sanad conversion for Non-Agricultural (NA) use.
   - Town & Country Planning (TCP) Department & Outline Development Plan (ODP): Settlement (A1, A2) vs Orchard / Cultivable / Natural Cover.
   - Section 16B & 17(2) amendments and conservation restrictions.
4. Coastal Regulation Zone (CRZ):
   - CRZ-I (Ecologically sensitive: mangroves, sand dunes).
   - CRZ-II (Built-up urban municipal areas).
   - CRZ-III (Rural coastal): No Development Zone (NDZ) 100m to 200m from High Tide Line (HTL). Strictly no new construction in NDZ; only repairs to authorized pre-1991 structures.
5. Mundkar & Tenancy Protections:
   - Goa, Daman and Diu Agricultural Tenancy Act 1964: "Tillers Day" rights; tenants cannot be evicted without statutory surrender.
   - Goa Mundkars (Protection from Eviction) Act 1975: Dwelling house rights of registered mundkars (agricultural laborers/caretakers). Always check Column 2 of Form I & XIV.
6. Financial & Investment Metrics:
   - Capital gains tax, 1% TDS under Section 194-IA on sales > ₹50 Lakhs.
   - Stamp duty (3.5% to 5%) and registration fees in Goa.
   - Net rental yield (6% to 9% in luxury North Goa hospitality villas Assagao, Siolim, Anjuna).
   - Mopa GOX Airport corridor capital appreciation.

Provide authoritative, structured, and highly readable answers formatted in GitHub-flavored markdown. Use bullet points, bold key terms, and clear cautionary steps. Always remind users to retain an independent Goa-registered advocate for executing title search reports.`;

/**
 * Intelligent Goa Land & Real Estate Domain Knowledge Engine
 * Provides instant institutional answers when Gemini API key is not yet set
 */
export function getDomainExpertResponse(query) {
  const q = (query || '').toLowerCase();

  // 1. Portuguese Civil Code / Succession / Ancestral Title
  if (q.includes('portuguese') || q.includes('civil code') || q.includes('ancestral') || q.includes('heir') || q.includes('inventario') || q.includes('inventário') || q.includes('succession') || q.includes('family property')) {
    return `### 🏛️ Portuguese Civil Code 1867 & Ancestral Title Due Diligence in Goa

Under the **Portuguese Civil Code of 1867** (which continues to govern family and succession law in Goa), buying ancestral property requires rigorous verification:

#### 1. "Comunhão de Bens" (Universal Community of Property)
* By default, every Goan marriage falls under this regime.
* Both husband and wife own an **undivided 50% share** in all properties owned prior to marriage or acquired during the marriage.
* **Critical Rule**: A husband or wife **cannot unilaterally sell** any property without the written signature and registered consent of their spouse.

#### 2. "Inventário" (Inventory Proceedings)
* When a property owner passes away, their undivided estate must undergo judicial or notarial **Inventário** proceedings in court to identify all legal heirs and demarcate specific shares.
* **Red Flag**: A deed signed by only one sibling claiming "all my brothers and sisters verbally gave me their share" is **legally voidable**. Any excluded child, grandchild, or nephew can challenge the sale up to 30 years later.

#### 3. Essential Safeguards for Buyers
1. **Demand the Final Inventário Order / Deed of Succession** (*Habilitação de Herdeiros*).
2. **Insist on All Co-Heirs Signing**: Every living legal heir and their respective spouses must execute the Deed of Conveyance as consenting parties.
3. **Obtain Family Pedigree Tree Affidavit**: Certified by the local Village Panchayat or Municipal Council.
4. **Publish Public Notices**: In two leading local newspapers (one English, one Marathi/Konkani) inviting claims within 15 days prior to executing the sale deed.`;
  }

  // 2. Form I & XIV / BhuNaksha / Cadastral Maps
  if (q.includes('form') || q.includes('xiv') || q.includes('i & xiv') || q.includes('bhunaksha') || q.includes('bhu naksha') || q.includes('cadastr') || q.includes('survey') || q.includes('subdivision') || q.includes('boundary')) {
    return `### 🗺️ Goa Form I & XIV and BhuNaksha Cadastral Verification Guide

In Goa, the **Form I & XIV** (Record of Rights) and the **BhuNaksha** cadastral map form the cornerstone of land ownership verification.

#### 1. What Form I & XIV Contains:
* **Form I (Title Section)**: Names of the occupants/owners (*Kabjedar*), Taluka, Village, Survey Number, and Sub-division Number.
* **Form XIV (Cultivation & Encumbrances)**: Nature of soil, crops grown, and critical details of **Tenants or Mundkars** in possession.
* **Official Portal**: Available online at the Directorate of Settlement & Land Records Goa: \`dslr.goa.gov.in\`.

#### 2. Key Checks on Form I & XIV:
1. **Name Matching**: Ensure the seller's name on government ID matches exactly with the occupant column. If inherited, check whether the Mutation (*Ferist*) has been completed.
2. **Column 2 Red Flags**: If any name appears under "Tenant" (*Kul*) or "Other Rights", the property cannot be sold or developed without statutory clearance or purchase under the Agricultural Tenancy Act.
3. **Area Discrepancies**: Compare the area registered in Form I & XIV (sq. meters) with the physical plot measurement and Title Deed.

#### 3. BhuNaksha Cadastral Overlay Steps:
1. Visit \`www.bhunaksha.goa.gov.in/bhunaksha\` or use KSHETRAM's **Cadastral Maps** tool in the sidebar.
2. Select your **Taluka** (e.g., Bardez), **Village** (e.g., Assagao), and **Survey/Subdivision Number**.
3. **Verify Boundary Stones**: Ensure physical corner stones on the ground match the digital cadastral polygon.
4. **Access Roads**: Check whether an official cadastral public road touches your plot boundary. Private access easements often lead to future access disputes.`;
  }

  // 3. Sanad / Agricultural Conversion / Zoning
  if (q.includes('sanad') || q.includes('conversion') || q.includes('zoning') || q.includes('settlement') || q.includes('orchard') || q.includes('tcp') || q.includes('odp') || q.includes('agricultural')) {
    return `### 🏗️ Land Conversion (Sanad) & Zoning Regulations in Goa

In Goa, land cannot be built upon unless it is classified as **Settlement** zone or has a valid **Conversion Sanad**.

#### 1. The Sanad Certificate (Section 32, Goa Land Revenue Code 1968)
* Any agricultural land (paddy field, orchard, plantation) requires a **Sanad** issued by the Collector / Deputy Collector to convert it for non-agricultural (NA) use (Residential, Commercial, or Industrial).
* Buying agricultural land on the promise of "Sanad is in process" carries high risk. **Always verify an issued, sealed Sanad certificate**.

#### 2. TCP Regional Plan 2021 & Zoning Codes:
* **Settlement Zone (A1 / A2)**: Permitted for residential luxury villas and apartments. Typical FAR (Floor Area Ratio) is 60% to 80% with 250–400 sq.m minimum plot sizes.
* **Orchard (Cultivable Land)**: Strictly limited. Farmhouses may be permissible only on large parcels (> 10,000 sq.m) under strict density ceilings.
* **Natural Cover / Private Forest / Hill Cutting**: Absolute prohibition on development under Section 17A of the Town and Country Planning Act. Hill cutting violations attract criminal penalties.

#### 3. Crucial Verification Documents:
1. **Collector's Conversion Sanad Order**: Confirm exact plot area and permitted usage.
2. **TCP Technical Clearance Order**: Issued by the Chief Town Planner.
3. **Panchayat / Municipal Construction License**: Valid at the time of construction.
4. **Occupancy Certificate (OC)**: Mandatory before utility connections (Electricity meter & PWD water line) can be officially sanctioned.`;
  }

  // 4. CRZ / Coastal Zone / Beachfront / HTL
  if (q.includes('crz') || q.includes('coast') || q.includes('beach') || q.includes('sea') || q.includes('high tide') || q.includes('ndz') || q.includes('ocean')) {
    return `### 🌊 Coastal Regulation Zone (CRZ) Norms for Goa Real Estate

Properties along Goa's Arabian Sea coast or inland tidal rivers (Mandovi, Chapora, Zuari, Sal) fall under the **Goa Coastal Zone Management Authority (GCZMA)**.

#### 1. CRZ Classifications in Goa:
* **CRZ-I**: Ecologically Sensitive Areas (Mangroves, sand dunes, turtle nesting beaches like Morjim/Agonda). **Zero construction permitted**.
* **CRZ-II**: Areas already substantially built up up to shoreline within municipal limits (e.g., portions of Miramar, Panaji). Construction permitted landward of approved roads.
* **CRZ-III (Rural / Village Shoreline)**:
  * **No Development Zone (NDZ)**: 0 to 200 meters from the High Tide Line (HTL) along the sea, and 50m to 100m along tidal rivers.
  * **Strict Law**: **No new residential construction is permitted within the NDZ**. Only traditional fishermen dwelling repairs or pre-1991 registered structures with approved GCZMA permissions are legal.
  * **Outside NDZ (200m–500m from HTL)**: Construction of hotels/villas permitted subject to 33% coverage, maximum height of 9 meters, and GCZMA Technical Clearance.

#### 2. Diligence for "Beachfront" Villas:
* If a property is advertised as "50 meters from the sand", demand the **GCZMA NOC** and verify whether the structure is an authentic pre-1991 reconstructed dwelling.
* Unauthorized structures in the NDZ face demolition orders from the High Court of Bombay at Goa and the National Green Tribunal (NGT).`;
  }

  // 5. Tenancy & Mundkar / Caretaker Issues
  if (q.includes('mundkar') || q.includes('tenant') || q.includes('caretaker') || q.includes('encumbrance') || q.includes('column 2')) {
    return `### 🛡️ Mundkar & Agricultural Tenancy Protections in Goa

Goa has specialized social reform legislation protecting traditional caretakers and tillers of the soil. Failing to audit these rights is one of the most common pitfalls for property buyers.

#### 1. The Goa Mundkars (Protection from Eviction) Act 1975
* A **Mundkar** is a person who has historically built a residential dwelling house on a Bhatkar's (landlord's) property with consent to watch over coconut orchards, cashew groves, or agricultural land.
* **Statutory Rights**: Mundkars have a statutory right to purchase their dwelling house and surrounding land (up to 300 sq.m in village panchayat areas, 120 sq.m in municipal areas) at a nominal government price.
* **Protection**: A landlord cannot evict a registered or de facto mundkar. Selling the property does not terminate mundkar rights.

#### 2. The Agricultural Tenancy Act 1964:
* Protects agricultural tenants (*Kuls*). Under "Tillers Day" provisions, registered tenants are deemed purchasers of agricultural land.

#### 3. Due Diligence Checklist:
1. Examine **Column 2 of Form XIV** for any name entry or remarks.
2. Conduct a **Physical Site Inspection**: Look for old tile-roof cottages, caretakers living on-site, or coconut plucking contracts.
3. If an existing caretaker resides on-site, obtain a registered, legally executed Deed of Relinquishment or Mamlatdar court clearance order before signing the sale deed.`;
  }

  // 6. Rental Yields / Cap Rates / Investment Metrics
  if (q.includes('yield') || q.includes('cap rate') || q.includes('invest') || q.includes('roi') || q.includes('returns') || q.includes('assagao') || q.includes('siolim') || q.includes('mopa') || q.includes('price')) {
    return `### 📊 Goa Luxury Real Estate: Yields, Cap Rates & Investment Metrics

Goa represents one of India's highest-yielding holiday home rental markets, driven by year-round domestic tourism and high-net-worth individual (HNI) migrations.

#### 1. Micro-Market Financial Benchmarks (2025–2026):
* **Assagao ("Beverly Hills of Goa")**:
  * Asset Class: 4–5 BHK Luxury Designer Villas with private pools.
  * Capital Values: ₹18,000 – ₹32,000 per sq.ft.
  * Gross Rental Yield: 8.5% – 11.0% (Average daily tariff: ₹35,000 – ₹75,000/night).
  * Cap Rate (Net): 6.8% – 8.2%.
* **Siolim & Vagator**:
  * Capital Values: ₹14,000 – ₹24,000 per sq.ft.
  * Gross Rental Yield: 7.5% – 9.5%.
  * Projected 5-Year CAGR: 12% – 16% (Boosted by direct Mopa Highway connector).
* **Candolim & Calangute (Commercial / Central)**:
  * Capital Values: ₹12,000 – ₹18,000 per sq.ft.
  * Rental Yield: 6.0% – 7.5% (High occupancy, lower average daily rates).

#### 2. Tax & Transaction Costs:
* **Stamp Duty in Goa**:
  * Up to ₹50 Lakhs: 3.5%
  * ₹50 Lakhs to ₹1 Crore: 4.0%
  * Above ₹1 Crore: 4.5% – 5.0%
* **Registration Fee**: 1.0% of consideration value.
* **TDS under Section 194-IA**: 1% mandatory deduction by the buyer on properties above ₹50 Lakhs.

#### 3. Key Catalysts Driving Capital Appreciation:
* **Manohar International Airport (MOPA / GOX)**: Has shifted the growth epicenter to Pernem and North Bardez.
* **Flyovers & 6-Lane Coastal Highways**: 30-minute transit time between Mopa and North Goa villa belts.`;
  }

  // 7. General Legal Checklist for Land Purchase in Goa
  return `### 📋 Comprehensive 30-Year Title Due Diligence Checklist for Goa Real Estate

Before executing any sale deed or paying advance tokens in Goa, ensure your advocate audits this 9-point title verification checklist:

1. **30-Year Title Search Report**: Tracing title history across registered deeds from the Sub-Registrar's Office (Bardez, Tiswadi, Pernem, Salcete).
2. **Current Nil-Encumbrance Certificate (EC)**: Form 15 & 16 certifying no registered mortgages or court attachments.
3. **Latest Form I & XIV (Record of Rights)**: Issued within the last 30 days from \`dslr.goa.gov.in\`.
4. **Cadastral Map (BhuNaksha)**: Cadastral plan showing exact boundary stones, adjacent plots, and certified public road access.
5. **Portuguese Civil Code Succession Audit**: Verified Deed of Succession (*Habilitação de Herdeiros*) or final Court Inventário order with all heirs consenting.
6. **Conversion Sanad & TCP Order**: Valid non-agricultural settlement order under Section 32 of Goa Land Revenue Code 1968.
7. **Approved Building Plan & Occupancy Certificate (OC)**: Issued by the local Village Panchayat / Municipal Council and Town & Country Planning.
8. **Essential Utilities NOC**: Active Goa Electricity Department (GED) meter connection and PWD freshwater line with no arrears.
9. **Public Newspaper Notice**: 15-day notice published in leading local English and Konkani/Marathi dailies.

---
💡 *KSHETRAM Tip: To connect live Gemini 1.5 Pro/Flash intelligence, click the **"Gemini API"** button at the top to add your API key!*`;
}

/**
 * Ask KSHETRAM AI Chatbot
 * Uses Gemini API if key is available; otherwise falls back to Goa Land RAG Domain Engine
 */
export async function askKshetramChatbot({ messages, apiKey }) {
  const activeKey = apiKey || getGeminiApiKey();
  const lastUserMsg = messages[messages.length - 1]?.content || '';

  // If no Gemini key is provided, return instant domain expert answer
  if (!activeKey) {
    // Artificial 400ms delay to give a smooth natural chat feel
    await new Promise(r => setTimeout(r, 450));
    return {
      text: getDomainExpertResponse(lastUserMsg),
      source: 'KSHETRAM Goa Land & Legal Domain Engine (Configure Gemini Key for Live Multi-turn LLM)',
      isLiveGemini: false
    };
  }

  // Prepare Gemini 3.5 payload
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${activeKey}`;

    // Format chat history for Gemini API
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.error?.message || `Gemini API HTTP ${response.status}`;
      console.warn('Gemini API call failed, using domain expert fallback:', errMsg);

      return {
        text: `${getDomainExpertResponse(lastUserMsg)}\n\n> ⚠️ *Note: Live Gemini API returned an error ("${errMsg}"). Switched automatically to KSHETRAM Goa Land Knowledge Engine.*`,
        source: 'KSHETRAM Domain Engine (Gemini Fallback)',
        isLiveGemini: false,
        error: errMsg
      };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const outputText = candidate?.content?.parts?.[0]?.text;

    if (!outputText) {
      throw new Error('No response text generated by Gemini.');
    }

    return {
      text: outputText,
      source: 'Google Gemini 3.5 Flash Lite (Live)',
      isLiveGemini: true
    };
  } catch (err) {
    console.error('Gemini request error:', err);
    return {
      text: `${getDomainExpertResponse(lastUserMsg)}\n\n> ⚠️ *Connection Notice: Could not reach Gemini endpoint (${err.message}). Displayed authoritative KSHETRAM Goa Land Intelligence record.*`,
      source: 'KSHETRAM Domain Engine (Offline Fallback)',
      isLiveGemini: false
    };
  }
}

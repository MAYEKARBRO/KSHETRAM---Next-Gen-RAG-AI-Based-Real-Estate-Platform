# KSHETRAM (क्षेत्रम्)
### Next-Gen RAG & AI Real Estate Platform for High-Value Ancestral Estates, Coastal Villas & Cadastral Land in Goa

---

## 📖 Executive Summary & Mission

**KSHETRAM** (Sanskrit: *क्षेत्रम्* — sacred ground, defined territory, or field) is an enterprise-grade, full-stack AI and Retrieval-Augmented Generation (RAG) real estate platform specifically engineered for the ultra-luxury, ancestral, and high-yield property markets of **Goa, India**.

Traditional property portals struggle with Goa's complex land tenure system: century-old Portuguese civil codes, ancestral undivided family properties, fragmented records of rights (*Form I & XIV*), un-mutated partition deeds (*Form D*), and cadastral discrepancies. **KSHETRAM bridges this trust and valuation deficit** by combining:

1. **Natural Language Voice Search & RAG**: Querying properties in conversational vernacular with intelligent constraint extraction.
2. **Automated Valuation Model (AVM)**: Instant micro-market comp valuation coupled with cross-portal comparative data (MagicBricks, 99acres, Housing.com).
3. **Document Vault Pre-Audit**: NLP-driven legal screening of land records to flag missing title links, tenancy entries, or encumbrances before listing.
4. **BhuNaksha Cadastral Mapping**: Satellite imagery overlaid with official cadastral parcel polygons and zoning parameters.
5. **Institutional Investor Analytics**: Real-time modeling of Cap Rates, 60% LTV Cash-on-Cash returns, seasonal occupancy, and infrastructure catalysts (Mopa Airport, NH66).
6. **Direct WhatsApp Bids**: High-intent verified buyer-to-seller negotiation pipeline with instant messaging alerts.

---

## 🎨 Architectural Brand Palette & Design System

The visual design is inspired by the classical Indo-Portuguese architectural heritage of Fontainhas, Salcete, and Bardez — combining aristocratic restraint with modern clarity:

| Color | Hex Code | Visual Metaphor & Purpose |
|:---|:---|:---|
| **Prussian Blue** | `#102542` | Primary brand tone; represents maritime history, legal authority, and institutional trust. |
| **Vibrant Coral** | `#F87060` | High-intent CTA accent inspired by bougainvillea blossoms and terracotta roof tiles. |
| **Alabaster Grey** | `#CDD7D6` | Soothing lime-wash neutral background for silky, glare-free reading. |
| **Khaki Beige** | `#B3A394` | Laterite sandstone stone tone used for borders, subtle cards, and heritage badges. |
| **Pure White** | `#FFFFFF` | Spatial contrast, card surfaces, and pristine typography readability. |

- **Typography**: Editorial headings set in **Cinzel** (classical serif) paired with **Plus Jakarta Sans** for crisp, modern numerical data and analytical dashboards.
- **Glassmorphism**: Soft background blurs (`backdrop-blur-md`), subtle translucent borders, and clean elevations — free of generic template styling.

---

## 👥 Target Audiences

| Target Group | Value Proposition |
|:---|:---|
| **Discerning Buyers** | Voice-powered property discovery, instant title verification status, cadastral boundary inspection, and seamless one-click cash offer submissions. |
| **Sellers & Landowners** | Instant AVM valuation, cross-platform comparative pricing, automated Form I & XIV title pre-screening before listing, and real-time WhatsApp bid notifications. |
| **Institutional & HNI Investors** | Predictive net rental yields, dynamic LTV (40%–75%) Cash-on-Cash modeling, 5-year CAGR forecasting, and infrastructure proximity tracking (Mopa International Airport, NH66 highway corridors). |
| **Real Estate Agents & Brokers** | Unified portfolio management, branded company listing badges, side-by-side multi-property comparison matrix, and transparent client negotiation logs. |

---

## 🏛️ Comprehensive Feature Breakdown: What This Application Does

### 1. 🌟 Welcome & Onboarding Experience (`WelcomePage.jsx`)
- **Editorial Brand Showcase**: Introduces KSHETRAM's philosophy, luxury aesthetic, and technological edge.
- **Audience Segmentation Cards**: Dedicated entry points for Buyers, Sellers, Institutional Investors, and Brokers.
- **Platform Capability Highlights**: Interactive previews of Voice Search, AVM Engine, Document Vault, and Cadastral Verification.
- **Call-to-Action Pipeline**: Effortlessly routes visitors to Login/Signup or directly into the live property exploration experience.

---

### 2. 🔐 Authentication, Profiles & Role System (`AuthPage.jsx` & `AuthContext.jsx`)
- **User Information Collection**:
  - First Name & Last Name
  - Phone Number (used for verified WhatsApp alerts)
  - Email & Password
  - User Role Selection: `Buyer`, `Seller`, `Rent`, `Broker`
  - Corporate Identity: Company Name & Company Logo URL (for agencies, brokerages, and developers)
- **Supabase Auth Integration**: Full email/password sign-in and sign-up with cryptographic session tokens.
- **PostgreSQL Profile Trigger**: Automatically creates a matching record in `public.profiles` upon signup via the `handle_new_user()` trigger.
- **Dual-Mode Graceful Fallback**: If Supabase is offline or unconfigured, the app falls back to an offline simulated demo user (**Armando De Sequeira — Heritage Estate Owner**) with localStorage state persistence.
- **Instant Role Switcher**: A sticky header switcher lets you instantaneously view the app as a Buyer, Seller, Investor, or Broker.

---

### 3. 🏡 Home Section: The 5 AI Real Estate Modules (`HomePage.jsx`)

#### A. Voice Search Section (`VoiceSearch.jsx`)
- **Speech-to-Text Recognition**: Built on the native Web Speech API (`webkitSpeechRecognition`) for hands-free voice input.
- **Natural Language Parsing**: Accepts complex queries like:
  > *"Find heritage villas in Assagao with verified titles under ₹7 Cr"*
  > *"Show me 4-bedroom sea view properties in Vagator with over 10% Cash on Cash return"*
- **RAG & NLP Extraction**: Automatically parses budget thresholds (crores/lakhs), micro-markets (Assagao, Siolim, Anjuna), property types, and title verification filters.
- **Voice Query Chips**: Pre-configured query pills allowing quick testing of popular search intents with a single tap.

#### B. Automated Valuation Model (AVM) (`AVMValuation.jsx`)
- **Hyper-Local Comp Valuation**: Calculates estimated market valuation, low-to-high valuation spreads, and average price per sq.ft. based on:
  - Micro-market historical trends (Assagao, Anjuna, Vagator, Siolim, Aldona, Porvorim, Morjim, Candolim)
  - Built-up area (interactive slider from 1,000 to 12,000 sq.ft.)
  - Property typology (Heritage Villa, Modern Villa, Coastal Apartment, Agricultural/Settlement Land)
- **Cross-Platform Comp Matrix**: Simulates web-scraped comparative listings from major portals:
  - **MagicBricks**: Assagao average ₹22,500/sq.ft.
  - **99acres**: Assagao average ₹23,100/sq.ft.
  - **Housing.com**: Assagao average ₹22,900/sq.ft.
- **Instant Valuation Delta**: Displays how KSHETRAM's algorithmic valuation compares against third-party public aggregator listings.

#### C. Document Vault Pre-Audit (`DocumentVaultAudit.jsx`)
- **Goa Land Records Pre-Screening**: Pre-audits **Form I & XIV** (Record of Rights) and **Form D** (Mutation Deeds) to detect title defects before public listing.
- **Automated Anomaly Detection**:
  - Column 2 (Occupant/Kabjedar) verification against the claimed seller
  - Column 3 (Tenancy) inspection — flags agricultural tenants (*Kul*) under the Goa Land Revenue Code
  - Column 5 & 6 (Other Rights / Encumbrances) — detects mortgages, bank hypothecations, and civil court disputes
  - Title continuity linkage analysis across previous conveyances
- **Pre-Packaged Sample Records**:
  1. *Clean Ancestral Title (Survey 142/6, Assagao)*: 96/100 Title Continuity Score.
  2. *Flagged Title with Pending Partition (Survey 88/2, Anjuna)*: 58/100 Score with actionable resolution recommendations.
- **Colab RAG Integration**: Forwards raw document text to an external Google Colab FastAPI notebook if configured.

#### D. Property Verification with BhuNaksha (`BhuNakshaViewer.jsx`)
- **Official Portal Link**: Direct access to the Goa Government BhuNaksha portal: [https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane](https://www.bhunaksha.goa.gov.in/bhunaksha/#home-pane).
- **Dual Lookup Modes**:
  1. **GPS Coordinates**: Direct decimal lat/long lookup (e.g. `15.5907, 73.7842`).
  2. **Cadastral Hierarchy**: Select District (`North Goa`), Taluka (`Bardez`), Village (`Assagao`), Sheet No (`04`), Survey No (`142`), and Sub-division (`6`).
- **Interactive Cadastral Satellite Overlay**:
  - High-resolution Esri World Imagery satellite basemap
  - True GeoJSON vector parcel polygon rendered directly over the plot in neon coral
  - Interactive parcel metadata popup displaying permissible Floor Area Ratio (FAR 0.60–0.80), Town & Country Planning (TCP) settlement zoning, surveyed area (sq. meters), and adjacent parcel boundaries.

#### E. Comparison Hub (`ComparisonMatrix.jsx`)
- Displays properties marked by the user across any screen (Explore, Maps, or Home).
- Provides side-by-side financial, cadastral, and physical metric comparisons.

---

### 4. 🔍 Explore Section: Filterable Property Catalog (`ExplorePage.jsx`)
- **Advanced Multi-Dimensional Filters**:
  - Micro-Market filter (Assagao, Anjuna, Vagator, Siolim, Aldona, Porvorim, Morjim, Candolim)
  - Price Range filter (₹1 Cr up to ₹25+ Cr)
  - Property Type (Villa, Heritage Manor, Coastal Apartment, Land Parcel)
  - Minimum Cap Rate & Minimum Cash-on-Cash Return sliders
  - Liquidity Risk rating filter (`Low`, `Moderate`, `High`)
  - Title Status toggle (`Verified Only`)
- **Luxury Property Cards (`PropertyCard.jsx`)**:
  - High-resolution photography carousel
  - Price, price/sqft, built-up sqft, bedrooms, and bathrooms
  - Micro-market badge & cadastral survey number
  - "Verified Title" green shield badge
  - One-tap "Mark for Comparison" button
- **Expanded Detail Modal (`PropertyDetailModal.jsx`)**:
  - Full photographic gallery
  - Comprehensive property narrative and specifications
  - Complete seller/broker credentials (name, phone, email, agency logo)
  - Cadastral metadata (District, Taluka, Village, Sheet, Survey, Sub-division)
  - Investor financial breakdown (Net yield, CAGR, gross rent)
  - Infrastructure proximity tags (Mopa Airport, Dabolim Airport, Hospitals, Highways)
  - **Instant Bid Submission Form**: Submit a cash offer with custom message and celebratory confetti animation.

---

### 5. 🗺️ Maps Section: Split-Screen Spatial Explorer (`MapsPage.jsx`)
- **Dual-Pane Ergonomic Layout**:
  - **Left Sidebar**: Real-time property search bar, micro-market quick chips, and scrollable property card listing with prices and title badges.
  - **Right Main Map**: Interactive Leaflet satellite map with custom house markers placed at exact GPS coordinates across North and South Goa.
- **Marker Interaction**:
  - Clicking any house marker centers the map, opens a luxury glassmorphism popup with property thumbnail, price, and key specs.
  - One-tap button to expand full details in the modal or toggle comparison bookmarking.

---

### 6. 📈 The Investor Portal: Institutional & HNI Wealth Builders (`InvestorPortalPage.jsx`)
Specifically engineered for family offices, HNI wealth builders, and real estate investment funds:

1. **Predictive Yield Analytics**:
   - Goa micro-market rental yield comparisons (Assagao 7.2%, Anjuna 6.8%, Siolim 6.5%, Vagator 7.5%)
   - Seasonal occupancy rate curves (Peak monsoon vs. winter season modeling)
   - 5-Year CAGR forecasting across major infrastructure corridors.
2. **Dynamic Portfolio Comparison Matrix**:
   - Interactive **Loan-to-Value (LTV) Slider** (40% to 75%)
   - Dynamically re-calculates **Cash-on-Cash Return** in real-time as leverage changes:
     $$\text{Cash-on-Cash Return} = \frac{\text{Net Operating Income} - \text{Annual Debt Service}}{\text{Equity Invested (Down Payment)}} \times 100$$
   - Side-by-side evaluation of Cap Rate, Annual Gross Rent, and Liquidity Risk.
3. **Infrastructure Catalyst Proximity Tracker**:
   - Precise distance calculation (in kilometers) to **Manohar International Airport (Mopa / GOX)**
   - Distance to **Dabolim International Airport (GOI)**
   - Distance to **Super-Specialty Tertiary Hospitals** (e.g., Manipal Hospital, Galaxy Hospital)
   - Distance to **NH66 National Highway** arterial corridors
   - Proximity to nearest beach coastlines.

---

### 7. 👤 Profile & Portfolio Management Section (`ProfilePage.jsx`)

#### A. User Account Overview
- Displays user's full name, phone number, email, registered role badge, and company details.

#### B. Add Property Listing Form
Allows sellers and brokers to list high-value properties with complete investor attributes:
- Title, description, property type, price, built-up sqft, plot sqft, bedrooms, bathrooms
- Location: Micro-market, district, taluka, village, address, and exact GPS coordinates (lat/long)
- Cadastral: Sheet number, Survey number, Sub-division number
- Title verification status & pre-audit notes
- Photo gallery URLs (with support for company logo upload)
- Investor metrics: Projected Cap Rate, Net Rental Yield, Cash-on-Cash Return, and Infrastructure proximities
- Real-time insertion into the Supabase `properties` table (with instant memory store fallback).

#### C. Seller Bids & Offers Hub
- Lists all incoming bids on the seller's properties.
- Displays bidder name, phone number, email, offer amount, timestamp, and buyer message.
- Status management: Accept, Counter, or Reject bids.
- **WhatsApp Notification Integration**: Generates an instant `wa.me` deep-link with pre-formatted message details (bidder name, offered price, property title) for zero-latency mobile negotiation.

#### D. "Right to be Forgotten" Account Erasure
- In strict adherence to global privacy regulations and Indian Digital Personal Data Protection (DPDP) standards:
- Requires entering the exact phrase **`ERASE PERMANENTLY`** into a confirmation modal.
- Invokes the backend `/api/account/erase` endpoint and PostgreSQL RPC `erase_user_data_completely(user_id)`.
- Cascades deletion across the user's profile, properties, bids, pre-audit logs, and Supabase auth account.

---

## 🏗️ System Architecture & Directory Layout

```
kshetram/
├── frontend/                               # React Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                  # Sticky header with role switcher & badge
│   │   │   ├── Footer.jsx                  # Architectural footer with quick links
│   │   │   ├── PropertyCard.jsx            # Luxury property grid card with badges
│   │   │   ├── PropertyDetailModal.jsx     # Expanded modal with bid form + WhatsApp
│   │   │   ├── VoiceSearch.jsx             # Web Speech API + RAG query parser
│   │   │   ├── AVMValuation.jsx            # Micro-market comp valuation + 3-portal matrix
│   │   │   ├── DocumentVaultAudit.jsx      # Form I & XIV legal screening engine
│   │   │   ├── BhuNakshaViewer.jsx         # Leaflet satellite + GeoJSON cadastral polygon
│   │   │   └── ComparisonMatrix.jsx        # Multi-property financial comparison
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # Supabase auth + local demo user fallback
│   │   │   └── PropertyContext.jsx         # Properties, filter state, comparison list, bids
│   │   ├── lib/
│   │   │   ├── api.js                      # Backend API client with offline fallback
│   │   │   ├── sampleData.js               # Seed Goa properties & currency formatter
│   │   │   └── supabaseClient.js           # Supabase JS SDK client instance
│   │   ├── pages/
│   │   │   ├── WelcomePage.jsx             # Landing presentation page
│   │   │   ├── AuthPage.jsx                # Sign in / Sign up with role picker
│   │   │   ├── HomePage.jsx                # Hub for the 5 AI real estate modules
│   │   │   ├── ExplorePage.jsx             # Filtered property grid
│   │   │   ├── MapsPage.jsx                # Split-screen map + sidebar list
│   │   │   ├── InvestorPortalPage.jsx      # Yields, LTV slider, infrastructure catalysts
│   │   │   └── ProfilePage.jsx             # Add listing, incoming bids, account erasure
│   │   ├── App.jsx                         # Main tab router & modal manager
│   │   ├── main.jsx                        # React root entry point
│   │   └── index.css                       # Tailwind + glassmorphism + custom animations
│   ├── tailwind.config.js                  # Custom Prussian Blue & Coral color tokens
│   ├── vite.config.js                      # Dev server with /api proxy to port 5000
│   └── package.json
│
├── backend/                                # Node.js Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── propertyController.js       # Property CRUD with Supabase + memory fallback
│   │   │   ├── avmController.js            # Instant AVM comp valuation endpoint
│   │   │   ├── vaultAuditController.js     # Form I & XIV audit + Colab bridge
│   │   │   ├── bhunakshaController.js      # Cadastral parcel & GeoJSON polygon generator
│   │   │   ├── bidsController.js           # Bids management + WhatsApp payload creator
│   │   │   └── accountController.js        # Complete account erasure controller
│   │   ├── services/
│   │   │   ├── avmEngine.js                # Micro-market pricing & 3-portal comp logic
│   │   │   ├── landRecordParser.js         # NLP engine for Form I & XIV land records
│   │   │   └── bhunakshaService.js         # Cadastral polygon generator for Goa talukas
│   │   ├── data/
│   │   │   └── mockData.js                 # 6 realistic Goa luxury property seed records
│   │   ├── routes/
│   │   │   └── apiRoutes.js                # Consolidated Express API route definitions
│   │   ├── supabaseAdmin.js                # Supabase client with connection verification
│   │   └── server.js                       # Express server initialization on port 5000
│   ├── .env                                # Backend environment configuration
│   └── package.json
│
├── database/
│   └── supabase_schema.sql                 # Complete idempotent PostgreSQL DDL schema
│
├── ai_colab/
│   ├── kshetram_rag_vault_preaudit.ipynb   # Google Colab notebook (FastAPI + RAG + Ngrok)
│   └── sample_form_I_XIV_sample.json       # Clean & flagged Form I & XIV test records
│
└── README.md
```

---

## 🚀 Quick Start Guide

You run the backend and frontend in two separate terminal windows.

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

---

### Step 1: Start the Backend API (Port 5001)
```powershell
cd backend
npm install
node src/server.js
```
Expected terminal output:
```
======================================================
🏛️  KSHETRAM API Server running on port 5001
🔗 Local API: http://localhost:5001
📊 Supabase Status: CONNECTED (or MOCK / FALLBACK MODE)
======================================================
```

> [!TIP]
> If you encounter `Error: listen EADDRINUSE: address already in use :::5001`, another process is using port 5001. Find the process ID using:
> ```powershell
> netstat -ano | findstr :5001
> ```

---

### Step 2: Start the Frontend Application (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
Open your web browser and navigate to:
```
http://localhost:5173
```

---

## 🗄️ Supabase Configuration (Auth, Database, Storage)

### Step 1: Execute the Database Schema
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** from the left navigation bar.
3. Open [`database/supabase_schema.sql`](database/supabase_schema.sql), copy its entire content, paste it into the SQL Editor, and click **Run**.
4. The script is **100% idempotent** (uses `DROP POLICY IF EXISTS` and `ON CONFLICT DO NOTHING`), so it can be re-run safely at any time.

### Step 2: Configure Environment Variables
Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`, then fill in your own values. Both `.env` files are ignored by Git. Find your Supabase URL and publishable/anon key in **Project Settings** → **API**:

Keep `SUPABASE_SERVICE_ROLE_KEY` and any other server-side secrets only in `backend/.env`. Values prefixed with `VITE_` are included in the browser bundle and are public; use only publishable keys there, and restrict Google API keys by website/referrer and API.

---

## 🤖 Google Gemini AI Land & Legal Advisor (`ChatbotPage.jsx`)

KSHETRAM features a dedicated **AI Land Advisor** accessible via the left sidebar:
- **Core Knowledge Base**: Specializes in Portuguese Civil Code 1867 (*Comunhão de Bens*, *Inventário*), Form I & XIV (Record of Rights), BhuNaksha cadastral maps, Section 32 Sanad conversions, CRZ-III No Development Zone regulations, and micro-market yield modeling.
- **Dual Operating Modes**:
  1. **Built-in Domain Knowledge Engine**: Instant answers to common legal, cadastral, and investment questions out-of-the-box with zero configuration.
  2. **Live Google Gemini 1.5 Flash/Pro**: Connect live multi-turn conversational intelligence by providing a restricted Gemini API key either in `frontend/.env` (`VITE_GEMINI_API_KEY`) or via the in-app **"Configure Gemini Key"** modal. Browser-provided keys are visible to users; do not use server secrets here.

> [!CAUTION]
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row-Level Security. Keep it strictly inside `backend/.env`. Never expose it in the frontend! If a key has ever been committed or shared, revoke/rotate it with its provider.

---

## 🤖 Google Colab AI/RAG Model Integration

If you have trained a custom document pre-audit or voice parser model in Jupyter:

1. Open [Google Colab](https://colab.research.google.com/) and upload [`ai_colab/kshetram_rag_vault_preaudit.ipynb`](ai_colab/kshetram_rag_vault_preaudit.ipynb).
2. Execute the notebook cells to launch the FastAPI micro-service.
3. Input your free [ngrok](https://ngrok.com) authtoken when prompted to create an HTTPS tunnel.
4. Copy your public tunnel URL and set it in `backend/.env`:
   ```env
   COLAB_RAG_API_URL=https://your-tunnel.ngrok-free.app
   ```
5. Kshetram's Node.js backend will automatically proxy all Document Vault audits and Voice queries to your Colab model! If the tunnel is offline, it gracefully falls back to the embedded JavaScript NLP parser.

---

## 🛡️ Data Privacy & Legal Compliance

KSHETRAM incorporates privacy-by-design principles:
- **Tenant Isolation**: Row-Level Security (RLS) ensures sellers only access bids directed to their listings, and users only view their personal vault audits.
- **Right to be Forgotten**: Accessible in the Profile tab; executing the erasure function permanently wipes the user's profile, listings, bids, valuation logs, and authentication credentials with complete database cascade.

---

## 📜 License
Developed for real estate excellence in Goa. Built with React, Node.js, Supabase, Leaflet, and modern AI.

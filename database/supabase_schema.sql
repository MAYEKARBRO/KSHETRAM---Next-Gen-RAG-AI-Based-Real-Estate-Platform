-- ==============================================================================
-- KSHETRAM - AI & RAG REAL ESTATE PLATFORM
-- Supabase PostgreSQL Schema, RLS Policies, Triggers & Storage Configuration
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('buyer', 'seller', 'rent', 'broker');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE liquidity_risk_level AS ENUM ('Low', 'Moderate', 'High');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE title_verification_status AS ENUM ('Verified', 'Pre-Audit Passed', 'Pending Audit', 'Encumbered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role user_role_type DEFAULT 'buyer',
    company_name TEXT,
    company_logo_url TEXT,
    bio TEXT,
    saved_properties UUID[] DEFAULT '{}',
    comparison_list UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROPERTIES TABLE (Goa Micro-markets & Luxury/Investor Specifications)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT DEFAULT 'villa', -- 'villa', 'apartment', 'land', 'commercial', 'heritage'
    listing_type TEXT DEFAULT 'sale',   -- 'sale', 'rent'
    price NUMERIC(15, 2) NOT NULL,
    price_per_sqft NUMERIC(10, 2),
    built_up_sqft NUMERIC(10, 2),
    plot_sqft NUMERIC(10, 2),
    bedrooms INT DEFAULT 3,
    bathrooms INT DEFAULT 3,
    
    -- Location & Cadastral Hierarchy
    micro_market TEXT NOT NULL,         -- e.g. 'Assagao', 'Anjuna', 'Vagator', 'Siolim', 'Aldona', 'Porvorim'
    district TEXT DEFAULT 'North Goa',  -- 'North Goa' or 'South Goa'
    taluka TEXT DEFAULT 'Bardez',       -- 'Bardez', 'Tiswadi', 'Salcete', 'Pernem', 'Mormugao'
    village TEXT,
    sheet_no TEXT,
    survey_no TEXT,
    subdivision_no TEXT,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- Assets & Amenities & Essential Utilities
    photos TEXT[] DEFAULT '{}',
    featured_image TEXT,
    amenities TEXT[] DEFAULT '{}',
    electricity_status TEXT DEFAULT '3-Phase Connected (15 kW)',
    water_status TEXT DEFAULT 'PWD Municipal Supply + Sweet Water Well',
    
    -- Document Vault & BhuNaksha Title Audit Metrics
    title_status title_verification_status DEFAULT 'Verified',
    form_i_xiv_verified BOOLEAN DEFAULT TRUE,
    form_d_mutation_clear BOOLEAN DEFAULT TRUE,
    cadastral_boundary_coordinates JSONB, -- GeoJSON polygon for BhuNaksha parcel
    audit_notes TEXT,
    
    -- HNI & Institutional Investor Portal Metrics
    cap_rate NUMERIC(5, 2) DEFAULT 7.50,          -- e.g., 7.50%
    cash_on_cash_return NUMERIC(5, 2) DEFAULT 11.20, -- at 60% LTV
    net_rental_yield NUMERIC(5, 2) DEFAULT 6.40,
    projected_5yr_cagr NUMERIC(5, 2) DEFAULT 14.80,
    liquidity_risk liquidity_risk_level DEFAULT 'Low',
    occupancy_rate NUMERIC(5, 2) DEFAULT 78.0,
    annual_gross_rent NUMERIC(12, 2),
    
    -- Infrastructure Catalysts Proximity (km)
    mopa_airport_dist_km NUMERIC(5, 1) DEFAULT 28.5,
    dabolim_airport_dist_km NUMERIC(5, 1) DEFAULT 42.0,
    hospital_dist_km NUMERIC(5, 1) DEFAULT 4.5,
    highway_dist_km NUMERIC(5, 1) DEFAULT 2.1,
    beach_dist_km NUMERIC(5, 1) DEFAULT 3.8,
    
    -- Seller / Agency Snapshot
    seller_name TEXT,
    seller_phone TEXT,
    seller_email TEXT,
    seller_company TEXT,
    seller_logo_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure Electricity & Water columns exist if table was already created
ALTER TABLE IF EXISTS public.properties ADD COLUMN IF NOT EXISTS electricity_status TEXT DEFAULT '3-Phase Connected (15 kW)';
ALTER TABLE IF EXISTS public.properties ADD COLUMN IF NOT EXISTS water_status TEXT DEFAULT 'PWD Municipal Supply + Sweet Water Well';

-- 5. BIDS & INQUIRIES TABLE (With WhatsApp notification tracking)
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    bid_amount NUMERIC(15, 2) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'countered', 'rejected'
    whatsapp_notified BOOLEAN DEFAULT FALSE,
    notification_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DOCUMENT VAULT PRE-AUDITS (Form I & XIV and Form D Title Link Pre-Screening)
CREATE TABLE IF NOT EXISTS public.document_vault_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL, -- 'Form I & XIV', 'Form D Mutation', 'Sale Deed', 'Partition Deed'
    document_url TEXT,
    file_name TEXT,
    district TEXT,
    taluka TEXT,
    village TEXT,
    survey_no TEXT,
    subdivision_no TEXT,
    occupant_names TEXT[] DEFAULT '{}',
    encumbrance_status TEXT DEFAULT 'Clear',
    missing_title_links TEXT[] DEFAULT '{}',
    audit_score INT DEFAULT 95, -- 0-100
    extracted_metadata JSONB DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUTOMATED VALUATION (AVM) LOGS
CREATE TABLE IF NOT EXISTS public.avm_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    micro_market TEXT NOT NULL,
    built_up_sqft NUMERIC(10, 2) NOT NULL,
    property_type TEXT NOT NULL,
    estimated_valuation NUMERIC(15, 2) NOT NULL,
    valuation_low NUMERIC(15, 2) NOT NULL,
    valuation_high NUMERIC(15, 2) NOT NULL,
    price_per_sqft_avg NUMERIC(10, 2) NOT NULL,
    comparable_sales JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH-SPEED FILTERING & GEOSPATIAL QUERIES
CREATE INDEX IF NOT EXISTS idx_properties_micro_market ON public.properties(micro_market);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_lat_lng ON public.properties(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bids_seller_id ON public.bids(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_property_id ON public.bids(property_id);
CREATE INDEX IF NOT EXISTS idx_document_audits_user ON public.document_vault_audits(user_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_vault_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avm_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view seller profiles, Users can update own profile
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Properties: Anyone can view active properties
DROP POLICY IF EXISTS "Active properties are viewable by all" ON public.properties;
CREATE POLICY "Active properties are viewable by all" 
ON public.properties FOR SELECT USING (is_active = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own properties" ON public.properties;
CREATE POLICY "Users can insert their own properties" 
ON public.properties FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
CREATE POLICY "Users can update their own properties" 
ON public.properties FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;
CREATE POLICY "Users can delete their own properties" 
ON public.properties FOR DELETE USING (auth.uid() = user_id);

-- Bids: Sellers see bids for their properties; Buyers see bids they made
DROP POLICY IF EXISTS "Sellers can view bids on their listings" ON public.bids;
CREATE POLICY "Sellers can view bids on their listings" 
ON public.bids FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Any authenticated or verified user can insert bid" ON public.bids;
CREATE POLICY "Any authenticated or verified user can insert bid" 
ON public.bids FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Sellers can update bid status" ON public.bids;
CREATE POLICY "Sellers can update bid status" 
ON public.bids FOR UPDATE USING (auth.uid() = seller_id);

-- Document Audits: Only the owner can view or create
DROP POLICY IF EXISTS "Users view own audits" ON public.document_vault_audits;
CREATE POLICY "Users view own audits" 
ON public.document_vault_audits FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own audits" ON public.document_vault_audits;
CREATE POLICY "Users insert own audits" 
ON public.document_vault_audits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AVM Logs: Users view own valuation queries
DROP POLICY IF EXISTS "AVM logs viewable by owner or service" ON public.avm_logs;
CREATE POLICY "AVM logs viewable by owner or service" 
ON public.avm_logs FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- 10. AUTH TRIGGER: AUTOMATICALLY CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        first_name, 
        last_name, 
        phone, 
        role, 
        company_name, 
        company_logo_url
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
        COALESCE(new.raw_user_meta_data->>'last_name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE((new.raw_user_meta_data->>'role')::public.user_role_type, 'buyer'::public.user_role_type),
        COALESCE(new.raw_user_meta_data->>'company_name', ''),
        COALESCE(new.raw_user_meta_data->>'company_logo_url', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name, 
        phone = EXCLUDED.phone;
    RETURN new;
EXCEPTION
    WHEN others THEN
        -- Never abort auth.users insertion if profile sync has an issue
        RETURN new;
END;
$$;
    
-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. RPC FUNCTION: COMPLETE USER DATA ERASURE ("Right to be Forgotten")
-- Cleanly wipes user profile, listings, bids, pre-audit logs, and auth account.
CREATE OR REPLACE FUNCTION public.erase_user_data_completely(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    deleted_properties_count INT := 0;
    deleted_bids_count INT := 0;
    deleted_audits_count INT := 0;
BEGIN
    -- Verify the requester is erasing their own data or is an admin
    IF auth.uid() <> target_user_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only erase your own personal account data.';
    END IF;

    -- Count records being deleted
    SELECT COUNT(*) INTO deleted_properties_count FROM public.properties WHERE user_id = target_user_id;
    SELECT COUNT(*) INTO deleted_bids_count FROM public.bids WHERE seller_id = target_user_id OR buyer_id = target_user_id;
    SELECT COUNT(*) INTO deleted_audits_count FROM public.document_vault_audits WHERE user_id = target_user_id;

    -- Delete child data
    DELETE FROM public.bids WHERE seller_id = target_user_id OR buyer_id = target_user_id;
    DELETE FROM public.document_vault_audits WHERE user_id = target_user_id;
    DELETE FROM public.avm_logs WHERE user_id = target_user_id;
    DELETE FROM public.properties WHERE user_id = target_user_id;
    DELETE FROM public.profiles WHERE id = target_user_id;

    -- Optionally trigger auth user deletion if needed
    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'User account, listings, bids, and audit records have been permanently wiped.',
        'properties_deleted', deleted_properties_count,
        'bids_deleted', deleted_bids_count,
        'audits_deleted', deleted_audits_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. STORAGE BUCKETS (Run in Supabase Storage configuration or via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('document-vault', 'document-vault', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view property images, authenticated users can upload
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images" 
ON storage.objects FOR SELECT USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own document vault files" ON storage.objects;
CREATE POLICY "Users can manage own document vault files" 
ON storage.objects FOR ALL USING (bucket_id = 'document-vault' AND auth.uid() = owner);


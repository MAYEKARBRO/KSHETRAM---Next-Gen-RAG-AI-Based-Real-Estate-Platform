import { supabase, isSupabaseConfigured } from '../supabaseAdmin.js';
import { INITIAL_PROPERTIES } from '../data/mockData.js';

// In-memory property store for instant zero-config fallback
let memoryProperties = [...INITIAL_PROPERTIES];

export async function getAllProperties(req, res) {
  try {
    const { 
      microMarket, 
      minPrice, 
      maxPrice, 
      propertyType, 
      minCapRate, 
      minCashOnCash, 
      liquidityRisk,
      verifiedOnly,
      query
    } = req.query;

    if (isSupabaseConfigured) {
      let q = supabase.from('properties').select('*');

      if (microMarket && microMarket !== 'All Locations') {
        q = q.ilike('micro_market', `%${microMarket}%`);
      }
      if (propertyType && propertyType !== 'all') {
        q = q.eq('property_type', propertyType);
      }
      if (minPrice) {
        q = q.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        q = q.lte('price', parseFloat(maxPrice));
      }
      if (minCapRate) {
        q = q.gte('cap_rate', parseFloat(minCapRate));
      }
      if (minCashOnCash) {
        q = q.gte('cash_on_cash_return', parseFloat(minCashOnCash));
      }
      if (liquidityRisk && liquidityRisk !== 'all') {
        q = q.eq('liquidity_risk', liquidityRisk);
      }
      if (verifiedOnly === 'true') {
        q = q.eq('title_status', 'Verified');
      }
      if (query) {
        q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%,micro_market.ilike.%${query}%`);
      }

      const { data, error } = await q.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    // Filter memory store
    let results = [...memoryProperties];

    if (microMarket && microMarket !== 'All Locations') {
      results = results.filter(p => p.micro_market.toLowerCase() === microMarket.toLowerCase());
    }
    if (propertyType && propertyType !== 'all') {
      results = results.filter(p => p.property_type.toLowerCase() === propertyType.toLowerCase());
    }
    if (minPrice) {
      results = results.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (minCapRate) {
      results = results.filter(p => (p.cap_rate || 0) >= parseFloat(minCapRate));
    }
    if (minCashOnCash) {
      results = results.filter(p => (p.cash_on_cash_return || 0) >= parseFloat(minCashOnCash));
    }
    if (liquidityRisk && liquidityRisk !== 'all') {
      results = results.filter(p => p.liquidity_risk === liquidityRisk);
    }
    if (verifiedOnly === 'true') {
      results = results.filter(p => p.title_status === 'Verified');
    }
    if (query) {
      const qLower = query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.address.toLowerCase().includes(qLower) ||
        p.micro_market.toLowerCase().includes(qLower)
      );
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error in getAllProperties:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getPropertyById(req, res) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const prop = memoryProperties.find(p => p.id === id);
    if (!prop) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    return res.json({ success: true, data: prop });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createProperty(req, res) {
  try {
    const body = req.body;
    const newProperty = {
      id: `prop-${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: body.user_id || 'user-active',
      title: body.title,
      description: body.description,
      property_type: body.property_type || 'villa',
      listing_type: body.listing_type || 'sale',
      price: parseFloat(body.price) || 50000000,
      price_per_sqft: body.built_up_sqft ? Math.round(parseFloat(body.price) / parseFloat(body.built_up_sqft)) : 22000,
      built_up_sqft: parseFloat(body.built_up_sqft) || 2500,
      plot_sqft: parseFloat(body.plot_sqft) || 4500,
      bedrooms: parseInt(body.bedrooms) || 3,
      bathrooms: parseInt(body.bathrooms) || 3,
      micro_market: body.micro_market || 'Assagao',
      district: body.district || 'North Goa',
      taluka: body.taluka || 'Bardez',
      village: body.village || body.micro_market || 'Assagao',
      sheet_no: body.sheet_no || '04',
      survey_no: body.survey_no || '101',
      subdivision_no: body.subdivision_no || '1',
      address: body.address || 'Goa',
      latitude: parseFloat(body.latitude) || 15.5907,
      longitude: parseFloat(body.longitude) || 73.7842,
      photos: Array.isArray(body.photos) && body.photos.length > 0 ? body.photos : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      featured_image: body.featured_image || (body.photos && body.photos[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      amenities: Array.isArray(body.amenities) ? body.amenities : ['Private Pool', 'Balcão', 'Security'],
      title_status: body.title_status || 'Pre-Audit Passed',
      electricity_status: body.electricity_status || '3-Phase Connected (15 kW)',
      water_status: body.water_status || 'PWD Municipal + Sweet Water Well',
      form_i_xiv_verified: Boolean(body.form_i_xiv_verified !== false),
      form_d_mutation_clear: Boolean(body.form_d_mutation_clear !== false),
      audit_notes: body.audit_notes || 'Uploaded via Kshetram Portal',
      
      // Investor defaults
      cap_rate: parseFloat(body.cap_rate) || 7.5,
      cash_on_cash_return: parseFloat(body.cash_on_cash_return) || 11.2,
      net_rental_yield: parseFloat(body.net_rental_yield) || 6.5,
      projected_5yr_cagr: parseFloat(body.projected_5yr_cagr) || 15.0,
      liquidity_risk: body.liquidity_risk || 'Low',
      occupancy_rate: parseFloat(body.occupancy_rate) || 80.0,
      annual_gross_rent: parseFloat(body.annual_gross_rent) || (parseFloat(body.price) * 0.08),

      // Infrastructure proximities
      mopa_airport_dist_km: parseFloat(body.mopa_airport_dist_km) || 27.5,
      dabolim_airport_dist_km: parseFloat(body.dabolim_airport_dist_km) || 43.0,
      hospital_dist_km: parseFloat(body.hospital_dist_km) || 4.5,
      highway_dist_km: parseFloat(body.highway_dist_km) || 2.5,
      beach_dist_km: parseFloat(body.beach_dist_km) || 3.5,

      // Seller details
      seller_name: body.seller_name || 'Seller',
      seller_phone: body.seller_phone || '+91 98000 00000',
      seller_email: body.seller_email || 'seller@kshetram.com',
      seller_company: body.seller_company || '',
      seller_logo_url: body.seller_logo_url || '',
      is_featured: false,
      is_active: true
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('properties').insert([newProperty]).select();
      if (!error && data) {
        return res.status(201).json({ success: true, data: data[0] });
      }
    }

    memoryProperties.unshift(newProperty);
    return res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Error in createProperty:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}


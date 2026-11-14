import { calculateAVMValuation, MICRO_MARKET_TRENDS } from '../services/avmEngine.js';
import { supabase, isSupabaseConfigured } from '../supabaseAdmin.js';

export async function getAVMValuation(req, res) {
  try {
    const { 
      microMarket, 
      builtUpSqft, 
      propertyType, 
      bedrooms, 
      hasPrivatePool, 
      isHeritage, 
      plotSqft 
    } = req.body;

    const valuation = calculateAVMValuation({
      microMarket: microMarket || 'Assagao',
      builtUpSqft: parseFloat(builtUpSqft) || 3000,
      propertyType: propertyType || 'villa',
      bedrooms: parseInt(bedrooms) || 4,
      hasPrivatePool: hasPrivatePool !== false,
      isHeritage: Boolean(isHeritage),
      plotSqft: parseFloat(plotSqft) || 5000
    });

    // Optionally log to Supabase if configured
    if (isSupabaseConfigured && req.body.user_id) {
      await supabase.from('avm_logs').insert([{
        user_id: req.body.user_id,
        micro_market: valuation.microMarket,
        built_up_sqft: valuation.builtUpSqft,
        property_type: valuation.propertyType,
        estimated_valuation: valuation.estimatedValuation,
        valuation_low: valuation.lowRange,
        valuation_high: valuation.highRange,
        price_per_sqft_avg: valuation.pricePerSqft,
        comparable_sales: valuation.recentComparableSales
      }]);
    }

    return res.json({ success: true, valuation });
  } catch (error) {
    console.error('Error in getAVMValuation:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export function getMicroMarketTrends(req, res) {
  return res.json({
    success: true,
    microMarkets: MICRO_MARKET_TRENDS
  });
}


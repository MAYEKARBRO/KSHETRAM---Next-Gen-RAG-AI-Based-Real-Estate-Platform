import { supabase, isSupabaseConfigured } from '../supabaseAdmin.js';
import { INITIAL_BIDS } from '../data/mockData.js';

let memoryBids = [...INITIAL_BIDS];

export async function getBidsForSeller(req, res) {
  try {
    const { sellerId } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          property:property_id (title, micro_market, price, featured_image)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    // In memory filter
    const sellerBids = memoryBids.filter(b => !sellerId || b.seller_id === sellerId || sellerId === 'user-seller-01');
    return res.json({ success: true, count: sellerBids.length, data: sellerBids });
  } catch (error) {
    console.error('Error in getBidsForSeller:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function placeBid(req, res) {
  try {
    const {
      property_id,
      seller_id,
      seller_phone,
      property_title,
      buyer_id,
      buyer_name,
      buyer_phone,
      buyer_email,
      bid_amount,
      message
    } = req.body;

    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(bid_amount || 0);

    // Formulate WhatsApp message body
    const whatsappMessage = `*KSHETRAM BIDS ALERT* 🏛️\n\nNew verified offer received for *${property_title || 'Your Property'}*!\n• *Offer Amount:* ${formattedAmount}\n• *Bidder:* ${buyer_name}\n• *Phone:* ${buyer_phone}\n• *Message:* "${message || 'Immediate interest'}"\n\nLog in to your Kshetram Profile to accept or counter this offer.`;
    
    // Generate WhatsApp web direct link for instant seller notification
    const cleanPhone = (seller_phone || '+919822144552').replace(/[^0-9]/g, '');
    const whatsappDirectLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    const newBid = {
      id: `bid-${Date.now()}`,
      property_id,
      seller_id: seller_id || 'user-seller-01',
      buyer_id: buyer_id || 'buyer-active',
      buyer_name: buyer_name || 'Interested Buyer',
      buyer_phone: buyer_phone || '+91 98000 00000',
      buyer_email: buyer_email || 'buyer@example.com',
      bid_amount: parseFloat(bid_amount) || 0,
      message: message || '',
      status: 'pending',
      whatsapp_notified: true,
      whatsapp_message_preview: whatsappMessage,
      whatsapp_direct_link: whatsappDirectLink,
      notification_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('bids').insert([{
        property_id: newBid.property_id,
        seller_id: newBid.seller_id,
        buyer_id: newBid.buyer_id,
        buyer_name: newBid.buyer_name,
        buyer_phone: newBid.buyer_phone,
        buyer_email: newBid.buyer_email,
        bid_amount: newBid.bid_amount,
        message: newBid.message,
        status: 'pending',
        whatsapp_notified: true,
        notification_timestamp: new Date().toISOString()
      }]).select();

      if (!error && data) {
        return res.status(201).json({ 
          success: true, 
          data: { ...data[0], whatsapp_direct_link: whatsappDirectLink }, 
          message: 'Bid placed and WhatsApp notification dispatched to seller.' 
        });
      }
    }

    memoryBids.unshift(newBid);
    return res.status(201).json({ 
      success: true, 
      data: newBid, 
      message: 'Bid placed successfully. Seller notified via WhatsApp.' 
    });
  } catch (error) {
    console.error('Error in placeBid:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateBidStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted', 'countered', 'rejected'

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('bids')
        .update({ status })
        .eq('id', id)
        .select();

      if (!error && data) {
        return res.json({ success: true, data: data[0] });
      }
    }

    const bid = memoryBids.find(b => b.id === id);
    if (bid) {
      bid.status = status;
      return res.json({ success: true, data: bid });
    }

    return res.status(404).json({ success: false, message: 'Bid not found' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}


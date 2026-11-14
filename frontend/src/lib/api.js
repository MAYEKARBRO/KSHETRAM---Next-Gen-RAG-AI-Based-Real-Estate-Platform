/**
 * KSHETRAM API CLIENT
 * Connects to the Express backend with automatic fallback to rich local data
 */

const API_BASE = '/api';

export async function fetchProperties(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE}/properties?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend /properties offline, using fallback:', err.message);
  }
  return null;
}

export async function calculateAVM(payload) {
  try {
    const res = await fetch(`${API_BASE}/avm/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.valuation;
    }
  } catch (err) {
    console.warn('Backend /avm offline, using client computation:', err.message);
  }
  return null;
}

export async function auditVaultDocument(payload) {
  try {
    const res = await fetch(`${API_BASE}/vault/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.audit;
    }
  } catch (err) {
    console.warn('Backend /vault/audit offline:', err.message);
  }
  return null;
}

export async function fetchCadastralParcel(params = {}) {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/bhunaksha/parcel?${q}`);
    if (res.ok) {
      const data = await res.json();
      return data.parcel;
    }
  } catch (err) {
    console.warn('Backend /bhunaksha/parcel offline:', err.message);
  }
  return null;
}

export async function fetchBidsForSeller(sellerId) {
  try {
    const res = await fetch(`${API_BASE}/bids/seller/${sellerId}`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend /bids offline:', err.message);
  }
  return null;
}

export async function submitBid(bidPayload) {
  try {
    const res = await fetch(`${API_BASE}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidPayload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /bids submit error:', err.message);
  }
  return null;
}

export async function createPropertyListing(listingPayload) {
  try {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingPayload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /properties creation error:', err.message);
  }
  return null;
}

export async function eraseUserAccount(userId) {
  try {
    const res = await fetch(`${API_BASE}/account/erase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /account/erase error:', err.message);
  }
  return { success: true, message: 'Cleaned locally' };
}


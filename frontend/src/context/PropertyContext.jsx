import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROPERTIES, INITIAL_BIDS } from '../lib/sampleData';
import { fetchProperties, submitBid, createPropertyListing } from '../lib/api';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [markedForComparison, setMarkedForComparison] = useState(['prop-assagao-01', 'prop-anjuna-02']);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    microMarket: 'All Locations',
    propertyType: 'all',
    minPrice: 0,
    maxPrice: 150000000,
    minCapRate: 0,
    minCashOnCash: 0,
    liquidityRisk: 'all',
    verifiedOnly: false,
    query: ''
  });

  // Try fetching fresh data from backend
  useEffect(() => {
    async function loadBackendData() {
      const data = await fetchProperties();
      if (data && data.length > 0) {
        setProperties(data);
      }
    }
    loadBackendData();
  }, []);

  const toggleComparison = (propertyId) => {
    setMarkedForComparison(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 properties simultaneously.');
          return prev;
        }
        return [...prev, propertyId];
      }
    });
  };

  const isMarked = (propertyId) => markedForComparison.includes(propertyId);

  const clearComparison = () => setMarkedForComparison([]);

  const addProperty = async (propData) => {
    const res = await createPropertyListing(propData);
    const created = (res && res.data) ? res.data : {
      ...propData,
      id: `prop-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setProperties(prev => [created, ...prev]);
    return created;
  };

  const placeBid = async (bidData) => {
    const res = await submitBid(bidData);
    const newBid = (res && res.data) ? res.data : {
      ...bidData,
      id: `bid-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      whatsapp_notified: true
    };
    setBids(prev => [newBid, ...prev]);
    return newBid;
  };

  // Filtered properties computation
  const filteredProperties = properties.filter(prop => {
    if (activeFilters.microMarket !== 'All Locations' && prop.micro_market.toLowerCase() !== activeFilters.microMarket.toLowerCase()) {
      return false;
    }
    if (activeFilters.propertyType !== 'all' && prop.property_type.toLowerCase() !== activeFilters.propertyType.toLowerCase()) {
      return false;
    }
    if (prop.price < activeFilters.minPrice || prop.price > activeFilters.maxPrice) {
      return false;
    }
    if (activeFilters.minCapRate > 0 && (prop.cap_rate || 0) < activeFilters.minCapRate) {
      return false;
    }
    if (activeFilters.minCashOnCash > 0 && (prop.cash_on_cash_return || 0) < activeFilters.minCashOnCash) {
      return false;
    }
    if (activeFilters.liquidityRisk !== 'all' && prop.liquidity_risk !== activeFilters.liquidityRisk) {
      return false;
    }
    if (activeFilters.verifiedOnly && prop.title_status !== 'Verified') {
      return false;
    }
    if (activeFilters.query) {
      const q = activeFilters.query.toLowerCase();
      const matchText = `${prop.title} ${prop.description} ${prop.micro_market} ${prop.address} ${prop.amenities?.join(' ')}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const comparedProperties = properties.filter(p => markedForComparison.includes(p.id));

  return (
    <PropertyContext.Provider value={{
      properties,
      filteredProperties,
      comparedProperties,
      markedForComparison,
      toggleComparison,
      isMarked,
      clearComparison,
      bids,
      addProperty,
      placeBid,
      activeFilters,
      setActiveFilters,
      selectedPropertyForModal,
      setSelectedPropertyForModal
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  return useContext(PropertyContext);
}


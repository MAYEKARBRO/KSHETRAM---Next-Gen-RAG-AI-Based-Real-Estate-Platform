import { lookupCadastralParcel, GOA_CADASTRAL_DATA } from '../services/bhunakshaService.js';

export function getCadastralParcel(req, res) {
  try {
    const { 
      gpsCoordinates, 
      district, 
      taluka, 
      village, 
      sheetNo, 
      surveyNo, 
      subdivisionNo 
    } = req.query;

    const parcel = lookupCadastralParcel({
      gpsCoordinates,
      district: district || 'North Goa',
      taluka: taluka || 'Bardez',
      village: village || 'Assagao',
      sheetNo: sheetNo || '04',
      surveyNo: surveyNo || '142',
      subdivisionNo: subdivisionNo || '6'
    });

    return res.json({ success: true, parcel });
  } catch (error) {
    console.error('Error in getCadastralParcel:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export function getCadastralHierarchy(req, res) {
  return res.json({ success: true, hierarchy: GOA_CADASTRAL_DATA });
}


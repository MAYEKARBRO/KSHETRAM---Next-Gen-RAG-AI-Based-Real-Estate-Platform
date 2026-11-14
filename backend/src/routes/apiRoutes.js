import express from 'express';
import { getAllProperties, getPropertyById, createProperty } from '../controllers/propertyController.js';
import { getAVMValuation, getMicroMarketTrends } from '../controllers/avmController.js';
import { auditDocument, getSampleRecords } from '../controllers/vaultAuditController.js';
import { getCadastralParcel, getCadastralHierarchy } from '../controllers/bhunakshaController.js';
import { getBidsForSeller, placeBid, updateBidStatus } from '../controllers/bidsController.js';
import { eraseUserAccountCompletely } from '../controllers/accountController.js';

const router = express.Router();

// Properties
router.get('/properties', getAllProperties);
router.get('/properties/:id', getPropertyById);
router.post('/properties', createProperty);

// Automated Valuation Model (AVM)
router.post('/avm/calculate', getAVMValuation);
router.get('/avm/micro-markets', getMicroMarketTrends);

// Document Vault Pre-Audit
router.post('/vault/audit', auditDocument);
router.get('/vault/sample-records', getSampleRecords);

// BhuNaksha Goa Cadastral Verification
router.get('/bhunaksha/parcel', getCadastralParcel);
router.get('/bhunaksha/hierarchy', getCadastralHierarchy);

// Bids & WhatsApp Notifications
router.get('/bids/seller/:sellerId', getBidsForSeller);
router.post('/bids', placeBid);
router.patch('/bids/:id/status', updateBidStatus);

// Account Erasure (Right to be Forgotten)
router.post('/account/erase', eraseUserAccountCompletely);

export default router;


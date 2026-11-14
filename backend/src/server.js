import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { isSupabaseConfigured } from './supabaseAdmin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KSHETRAM - AI & RAG Real Estate Platform',
    version: '1.0.0',
    supabaseConnected: isSupabaseConfigured,
    endpoints: {
      properties: '/api/properties',
      avm: '/api/avm/calculate',
      vaultAudit: '/api/vault/audit',
      bhuNaksha: '/api/bhunaksha/parcel',
      bids: '/api/bids',
      accountErasure: '/api/account/erase'
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏛️  KSHETRAM API Server running on port ${PORT}`);
  console.log(`🔗 Local API: http://localhost:${PORT}`);
  console.log(`📊 Supabase Status: ${isSupabaseConfigured ? 'CONNECTED' : 'MOCK / FALLBACK MODE'}`);
  console.log(`======================================================\n`);
});


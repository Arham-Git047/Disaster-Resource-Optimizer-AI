// File: models/Need.js

import mongoose from 'mongoose';

const NeedSchema = new mongoose.Schema({
  needType: { type: String, default: 'Other' },
  urgency: { type: String, default: 'Medium' },
  details: { type: String },
  message: { type: String },
  location: { type: String },
  phoneNumber: { type: String },
  status: { type: String, default: 'unverified' },
  verifiedBy: { type: String },
  verificationNotes: { type: String },
  verifiedAt: { type: Date }
}, { timestamps: true });

const Need = mongoose.models.Need || mongoose.model('Need', NeedSchema);
export default Need;

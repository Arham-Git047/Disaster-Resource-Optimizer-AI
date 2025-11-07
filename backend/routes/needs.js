import express from 'express';
import {
  getUnverifiedNeeds,
  getAllNeeds,
  verifyNeed,
  syncVerifications,
  getNeedById
} from '../controllers/needsController.js';

const router = express.Router();

// list all needs (statistics)
router.get('/', getAllNeeds);

// list unverified
router.get('/unverified', getUnverifiedNeeds);

// verify a single need
router.put('/:id/verify', verifyNeed);

// sync multiple verifications
router.post('/sync', syncVerifications);

// get need by id
router.get('/:id', getNeedById);

export default router;
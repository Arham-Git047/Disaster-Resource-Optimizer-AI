import Need from '../models/Need.js';

export const getUnverifiedNeeds = async (req, res) => {
  try {
    const needs = await Need.find({ status: 'unverified' }).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: needs.length, data: needs });
  } catch (error) {
    console.error('Error fetching needs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch needs', error: error.message });
  }
};

export const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find().sort({ createdAt: -1 }).limit(1000);
    const stats = {
      total: needs.length,
      unverified: needs.filter(n => n.status === 'unverified').length,
      verified: needs.filter(n => n.status === 'verified').length,
      fulfilled: needs.filter(n => n.status === 'fulfilled').length
    };
    res.json({ success: true, stats, data: needs });
  } catch (error) {
    console.error('Error fetching all needs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch needs', error: error.message });
  }
};

export const verifyNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteerId, notes } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Missing need id' });

    const need = await Need.findByIdAndUpdate(
      id,
      {
        status: 'verified',
        verifiedBy: volunteerId || `volunteer-${Date.now()}`,
        verifiedAt: new Date(),
        verificationNotes: notes || ''
      },
      { new: true }
    );

    if (!need) return res.status(404).json({ success: false, message: 'Need not found' });
    res.json({ success: true, message: 'Need verified', data: need });
  } catch (error) {
    console.error('Error verifying need:', error);
    res.status(500).json({ success: false, message: 'Failed to verify need', error: error.message });
  }
};

export const syncVerifications = async (req, res) => {
  try {
    const { verifications } = req.body;
    if (!Array.isArray(verifications)) return res.status(400).json({ success: false, message: 'Verifications must be an array' });

    const results = [];
    for (const v of verifications) {
      if (!v?.needId) {
        results.push({ needId: v?.needId || null, success: false, error: 'Invalid verification entry' });
        continue;
      }
      try {
        const verifiedAt = v.verifiedAt ? new Date(v.verifiedAt) : new Date();
        const need = await Need.findByIdAndUpdate(
          v.needId,
          { status: 'verified', verifiedBy: v.volunteerId || `volunteer-${Date.now()}`, verifiedAt, verificationNotes: v.notes || '' },
          { new: true }
        );
        results.push({ needId: v.needId, success: true, data: need });
      } catch (err) {
        results.push({ needId: v.needId, success: false, error: err.message });
      }
    }

    res.json({ success: true, message: `Synced ${results.filter(r => r.success).length}/${results.length} verifications`, results });
  } catch (error) {
    console.error('Error syncing verifications:', error);
    res.status(500).json({ success: false, message: 'Failed to sync verifications', error: error.message });
  }
};

export const getNeedById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Missing need id' });
    const need = await Need.findById(id);
    if (!need) return res.status(404).json({ success: false, message: 'Need not found' });
    res.json({ success: true, data: need });
  } catch (error) {
    console.error('Error fetching need:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch need', error: error.message });
  }
};

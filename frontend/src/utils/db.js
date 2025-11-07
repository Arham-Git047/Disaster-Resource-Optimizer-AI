import { openDB } from 'idb';

const DB_NAME = 'disaster-response-db';
const DB_VERSION = 1;
const NEEDS_STORE = 'needs';
const PENDING_STORE = 'pending-verifications';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(NEEDS_STORE)) {
        db.createObjectStore(NEEDS_STORE, { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        const store = db.createObjectStore(PENDING_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('synced', 'synced');
      }
    },
  });
};

export const cacheNeeds = async (needs) => {
  const db = await initDB();
  await db.clear(NEEDS_STORE);
  await Promise.all(needs.map((need) => db.put(NEEDS_STORE, need)));
};

export const getCachedNeeds = async () => {
  const db = await initDB();
  return db.getAll(NEEDS_STORE);
};

export const addPendingVerification = async (needId, volunteerId, notes = '') => {
  const db = await initDB();
  await db.add(PENDING_STORE, {
    needId,
    volunteerId,
    notes,
    verifiedAt: new Date().toISOString(),
    synced: false,
  });
};

export const getPendingVerifications = async () => {
  const db = await initDB();
  try {
    return await db.getAllFromIndex(PENDING_STORE, 'synced', false);
  } catch (e) {
    const all = await db.getAll(PENDING_STORE);
    return all.filter((v) => !v.synced);
  }
};

export const markVerificationSynced = async (id) => {
  const db = await initDB();
  const verification = await db.get(PENDING_STORE, id);
  if (verification) {
    verification.synced = true;
    await db.put(PENDING_STORE, verification);
  }
};

export const updateNeedLocally = async (needId, updates) => {
  const db = await initDB();
  const need = await db.get(NEEDS_STORE, needId);
  if (need) {
    Object.assign(need, updates);
    await db.put(NEEDS_STORE, need);
  }
};

export const clearAllData = async () => {
  const db = await initDB();
  await db.clear(NEEDS_STORE);
  await db.clear(PENDING_STORE);
};

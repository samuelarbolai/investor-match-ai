const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS || '1800000', 10); // 30 minutes default
const store = new Map();

export function getCached(id) {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() - entry.lastTouchedAt > CACHE_TTL_MS) {
    store.delete(id);
    return null;
  }
  return entry;
}

export function setCached(id, data) {
  store.set(id, { ...data, lastTouchedAt: Date.now() });
}

export function touch(id) {
  const entry = store.get(id);
  if (entry) entry.lastTouchedAt = Date.now();
}

export function deleteCached(id) {
  store.delete(id);
}

export function sweep() {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now - entry.lastTouchedAt > CACHE_TTL_MS) {
      store.delete(id);
    }
  }
}

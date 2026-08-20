import type { SituationItem } from "../../shared/types";

/**
 * Stub di cache per l'ambiente edge/serverless.
 * In produzione sostituire con Upstash Redis (UPSTASH_REDIS_REST_URL/TOKEN)
 * o un KV store equivalente del provider di hosting scelto.
 */
interface CacheEntry {
  data: SituationItem[];
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

export async function getCached(key: string): Promise<SituationItem[] | null> {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

export async function setCached(
  key: string,
  data: SituationItem[],
  ttlSeconds: number
): Promise<void> {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

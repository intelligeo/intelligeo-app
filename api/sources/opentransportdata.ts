import type { SituationItem } from "../../shared/types";
import { getCached, setCached } from "../cache";

const CACHE_KEY = "sources:opentransportdata:disruptions";
const CACHE_TTL_SECONDS = 60;

/**
 * Esempio di fetcher per le perturbazioni del trasporto pubblico svizzero.
 * Fonte: opentransportdata.swiss (richiede registrazione per rate limit piu' alti).
 * Documentazione: https://opentransportdata.swiss/it/
 *
 * NOTE: endpoint e formato di risposta indicativi — da verificare e adattare
 * alla versione corrente dell'API prima dell'uso in produzione.
 */
export async function fetchTransportDisruptions(): Promise<SituationItem[]> {
  const cached = await getCached(CACHE_KEY);
  if (cached) return cached;

  const apiKey = process.env.OPENTRANSPORTDATA_API_KEY;
  const response = await fetch(
    "https://api.opentransportdata.swiss/la/cus/v1/disruptions",
    {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    }
  );

  if (!response.ok) {
    throw new Error(`opentransportdata.swiss: risposta ${response.status}`);
  }

  const payload = (await response.json()) as { disruptions?: any[] };
  const items: SituationItem[] = (payload.disruptions ?? []).map((d, index) => ({
    id: `transport-${d.id ?? index}`,
    theme: "transport",
    title: d.title ?? "Perturbazione trasporto pubblico",
    description: d.description,
    severity: "warning",
    location: d.lat && d.lon ? { lat: d.lat, lon: d.lon, label: d.stationName } : undefined,
    source: { name: "opentransportdata.swiss", url: "https://opentransportdata.swiss" },
    timestamp: d.publishedAt ?? new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  }));

  await setCached(CACHE_KEY, items, CACHE_TTL_SECONDS);
  return items;
}

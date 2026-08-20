import type { SituationItem } from "../../shared/types";
import { getCached, setCached } from "../cache";

const CACHE_KEY = "sources:meteoswiss:warnings";
const CACHE_TTL_SECONDS = 300;

/** Bounding box del Ticino per il filtro spaziale (lon/lat). */
const TICINO_BBOX = { minLon: 8.35, minLat: 45.75, maxLon: 9.35, maxLat: 46.65 };

function isInTicino(lat?: number, lon?: number): boolean {
  if (lat === undefined || lon === undefined) return false;
  return (
    lat >= TICINO_BBOX.minLat &&
    lat <= TICINO_BBOX.maxLat &&
    lon >= TICINO_BBOX.minLon &&
    lon <= TICINO_BBOX.maxLon
  );
}

/**
 * Esempio di fetcher per gli avvisi meteo severi di MeteoSvizzera (opendata).
 * Documentazione: https://www.meteoswiss.admin.ch/services-and-publications/service/open-data.html
 *
 * NOTE: endpoint indicativo — MeteoSvizzera pubblica i dataset open data con
 * URL e formati specifici da verificare (spesso CSV/JSON su un bucket pubblico).
 */
export async function fetchWeatherWarnings(): Promise<SituationItem[]> {
  const cached = await getCached(CACHE_KEY);
  if (cached) return cached;

  const response = await fetch(
    "https://data.geo.admin.ch/ch.meteoschweiz.warnungen/warnings.json"
  );

  if (!response.ok) {
    throw new Error(`MeteoSvizzera: risposta ${response.status}`);
  }

  const payload = (await response.json()) as { warnings?: any[] };
  const items: SituationItem[] = (payload.warnings ?? [])
    .filter((w) => isInTicino(w.lat, w.lon))
    .map((w, index) => ({
      id: `hazard-meteo-${w.id ?? index}`,
      theme: "hazards",
      title: w.headline ?? "Avviso meteo severo",
      description: w.description,
      severity: w.level >= 3 ? "critical" : w.level === 2 ? "warning" : "info",
      location: { lat: w.lat, lon: w.lon, label: w.region },
      source: { name: "MeteoSvizzera", url: "https://www.meteoswiss.admin.ch" },
      timestamp: w.validFrom ?? new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
    }));

  await setCached(CACHE_KEY, items, CACHE_TTL_SECONDS);
  return items;
}

import type { SituationItem } from "../../shared/types";
import { fetchTransportDisruptions } from "../sources/opentransportdata";
import { fetchWeatherWarnings } from "../sources/meteoswiss";

/**
 * Punto unico di aggregazione: interroga i fetcher per fonte, unisce i risultati
 * e li ordina per timestamp. Da esporre come endpoint edge (es. GET /api/situation).
 */
export async function aggregateSituationItems(): Promise<SituationItem[]> {
  const results = await Promise.allSettled([
    fetchTransportDisruptions(),
    fetchWeatherWarnings(),
  ]);

  const items: SituationItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      console.error("Errore nel recupero di una fonte:", result.reason);
    }
  }

  return items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

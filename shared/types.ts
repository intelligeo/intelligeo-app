export type ThemeKey =
  | "events"
  | "hazards"
  | "news"
  | "transport"
  | "finance"
  | "infrastructure";

export type Severity = "info" | "warning" | "critical";

export interface SituationItemSource {
  name: string;
  url: string;
  license?: string;
}

export interface SituationItemLocation {
  lat: number;
  lon: number;
  label?: string;
}

export interface SituationItem {
  id: string;
  theme: ThemeKey;
  title: string;
  description?: string;
  severity?: Severity;
  location?: SituationItemLocation;
  source: SituationItemSource;
  /** Data/ora dell'evento originale (ISO 8601) */
  timestamp: string;
  /** Data/ora in cui il dato e' stato recuperato/normalizzato (ISO 8601) */
  fetchedAt: string;
}

export const THEME_LABELS: Record<ThemeKey, string> = {
  events: "Eventi",
  hazards: "Pericoli naturali",
  news: "Cronaca",
  transport: "Trasporti pubblici",
  finance: "Finanza",
  infrastructure: "Infrastrutture critiche",
};

export const THEME_ORDER: ThemeKey[] = [
  "hazards",
  "news",
  "transport",
  "events",
  "infrastructure",
  "finance",
];

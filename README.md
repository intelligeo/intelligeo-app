# Ticino Monitor

Carta di situazione per il Cantone Ticino: eventi locali/regionali, pericoli naturali,
cronaca, stato dei trasporti pubblici, finanza e infrastrutture critiche di approvvigionamento.

## Requisiti

- Node.js >= 18 (non rilevato nell'ambiente di scaffolding: installarlo prima di procedere)

## Avvio in locale

```
npm install
npm run dev
```

Apri <http://localhost:5173>

## Struttura del progetto

- `src/map` — inizializzazione MapLibre GL, layer base (swisstopo) e layer pericoli
- `src/panels` — pannelli tematici (eventi, pericoli, cronaca, trasporti, finanza, infrastrutture)
- `src/panels/data/mock` — dati di esempio in attesa di collegare le fonti reali
- `src/store` — stato condiviso tra mappa e pannelli
- `shared/types.ts` — modello dati comune `SituationItem`
- `api/sources` — funzioni edge di esempio per normalizzare le fonti esterne
- `api/aggregate` — logica di aggregazione/merge per tema
- `api/cache.ts` — stub per la cache (Redis/Upstash in produzione)

## Stato attuale

Scaffolding iniziale: mappa centrata sul Ticino con tile swisstopo, pannelli con dati mock
tipizzati secondo il modello `SituationItem`, ed esempi di funzioni edge non ancora collegate
al frontend. Prossimi passi: sostituire i mock con i fetcher reali elencati in `api/sources`.

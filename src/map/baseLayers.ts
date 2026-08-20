import type { StyleSpecification } from "maplibre-gl";

/**
 * Bounding box approssimativo del Cantone Ticino (lon/lat).
 * Usato per limitare la vista iniziale della mappa.
 */
export const TICINO_BOUNDS: [[number, number], [number, number]] = [
  [8.35, 45.75], // sud-ovest
  [9.35, 46.65], // nord-est
];

export const TICINO_CENTER: [number, number] = [8.95, 46.17];

/**
 * Stile MapLibre basato sui tile raster di swisstopo (map.geo.admin.ch),
 * dati aperti della Confederazione (licenza: swisstopo Open Data).
 * https://www.geo.admin.ch/it/geo-services/geo-services/api-geo-admin-ch.html
 */
export function createBaseStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      "swisstopo-pixelkarte": {
        type: "raster",
        tiles: [
          "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.swisstopo.admin.ch" target="_blank" rel="noopener">swisstopo</a>',
      },
    },
    layers: [
      {
        id: "swisstopo-pixelkarte-layer",
        type: "raster",
        source: "swisstopo-pixelkarte",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}

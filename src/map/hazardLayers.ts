import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * Layer opzionale con le carte dei pericoli naturali del geoportale federale
 * (map.geo.admin.ch), es. carta di pericolo valanghe/piene.
 * Il layer WMS esatto va scelto in base al tema attivo; qui un esempio
 * generico da adattare (vedi catalogo layer su api3.geo.admin.ch/rest/services).
 */
const HAZARD_LAYER_ID = "hazard-layer";

export function addHazardLayer(map: MapLibreMap, wmsLayerName: string) {
  if (map.getSource(HAZARD_LAYER_ID)) {
    map.removeLayer(HAZARD_LAYER_ID);
    map.removeSource(HAZARD_LAYER_ID);
  }

  map.addSource(HAZARD_LAYER_ID, {
    type: "raster",
    tiles: [
      `https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
        `&LAYERS=${encodeURIComponent(wmsLayerName)}` +
        `&STYLES=&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=true`,
    ],
    tileSize: 256,
  });

  map.addLayer({
    id: HAZARD_LAYER_ID,
    type: "raster",
    source: HAZARD_LAYER_ID,
    paint: { "raster-opacity": 0.65 },
  });
}

export function removeHazardLayer(map: MapLibreMap) {
  if (map.getLayer(HAZARD_LAYER_ID)) map.removeLayer(HAZARD_LAYER_ID);
  if (map.getSource(HAZARD_LAYER_ID)) map.removeSource(HAZARD_LAYER_ID);
}

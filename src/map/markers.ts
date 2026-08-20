import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import type { SituationItem } from "@shared/types";

const SOURCE_ID = "situation-items";
const LAYER_ID = "situation-items-layer";

const SEVERITY_COLOR: Record<string, string> = {
  info: "#3b82f6",
  warning: "#f59e0b",
  critical: "#ef4444",
};

function toFeatureCollection(items: SituationItem[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: items
      .filter((item) => item.location)
      .map((item) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.location!.lon, item.location!.lat],
        },
        properties: {
          id: item.id,
          title: item.title,
          theme: item.theme,
          severity: item.severity ?? "info",
        },
      })),
  };
}

export function initMarkersLayer(map: MapLibreMap) {
  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: toFeatureCollection([]),
  });

  map.addLayer({
    id: LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": 6,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#0f172a",
      "circle-color": [
        "match",
        ["get", "severity"],
        "critical",
        SEVERITY_COLOR.critical,
        "warning",
        SEVERITY_COLOR.warning,
        SEVERITY_COLOR.info,
      ],
    },
  });
}

export function updateMarkers(map: MapLibreMap, items: SituationItem[]) {
  const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
  source?.setData(toFeatureCollection(items));
}

export function onMarkerClick(
  map: MapLibreMap,
  handler: (id: string) => void
) {
  map.on("click", LAYER_ID, (e) => {
    const feature = e.features?.[0];
    const id = feature?.properties?.id;
    if (id) handler(id);
  });
  map.on("mouseenter", LAYER_ID, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", LAYER_ID, () => {
    map.getCanvas().style.cursor = "";
  });
}

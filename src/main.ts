import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createBaseStyle, TICINO_BOUNDS, TICINO_CENTER } from "@/map/baseLayers";
import { initMarkersLayer, updateMarkers, onMarkerClick } from "@/map/markers";
import { initPanel } from "@/panels/panelManager";
import { situationStore } from "@/store/situationStore";
import { mockItems } from "@/panels/data/mock/mockItems";

const map = new maplibregl.Map({
  container: "map",
  style: createBaseStyle(),
  center: TICINO_CENTER,
  zoom: 9,
  maxBounds: TICINO_BOUNDS,
});

map.addControl(new maplibregl.NavigationControl(), "top-right");
map.addControl(new maplibregl.AttributionControl({ compact: true }));

map.on("load", () => {
  initMarkersLayer(map);
  updateMarkers(map, situationStore.getItems());

  onMarkerClick(map, (id) => {
    const item = situationStore.getItems().find((i) => i.id === id);
    if (item) situationStore.setActiveTheme(item.theme);
  });

  situationStore.subscribe(() => updateMarkers(map, situationStore.getItems()));

  // TODO: sostituire con il caricamento dai fetcher reali (api/sources + api/aggregate)
  situationStore.setItems(mockItems);
});

initPanel(map);

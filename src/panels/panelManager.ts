import type { Map as MapLibreMap } from "maplibre-gl";
import { THEME_LABELS, THEME_ORDER, type SituationItem, type ThemeKey } from "@shared/types";
import { situationStore } from "@/store/situationStore";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("it-CH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTabs(container: HTMLElement) {
  container.innerHTML = "";
  for (const theme of THEME_ORDER) {
    const btn = document.createElement("button");
    btn.textContent = THEME_LABELS[theme];
    btn.classList.toggle("active", situationStore.getActiveTheme() === theme);
    btn.addEventListener("click", () => situationStore.setActiveTheme(theme));
    container.appendChild(btn);
  }
}

function renderItemCard(item: SituationItem, map: MapLibreMap): HTMLElement {
  const card = document.createElement("div");
  card.className = "item-card";

  const badge = document.createElement("span");
  badge.className = `badge ${item.severity ?? "info"}`;
  badge.textContent = item.severity ?? "info";
  card.appendChild(badge);

  const title = document.createElement("h3");
  title.textContent = item.title;
  card.appendChild(title);

  if (item.description) {
    const desc = document.createElement("p");
    desc.textContent = item.description;
    card.appendChild(desc);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span>${item.source.name}</span><span>${formatTime(item.timestamp)}</span>`;
  card.appendChild(meta);

  if (item.location) {
    card.addEventListener("click", () => {
      map.flyTo({ center: [item.location!.lon, item.location!.lat], zoom: 12 });
    });
  }

  return card;
}

export function initPanel(map: MapLibreMap) {
  const tabsContainer = document.getElementById("panel-tabs")!;
  const contentContainer = document.getElementById("panel-content")!;

  function render() {
    renderTabs(tabsContainer);
    const theme: ThemeKey = situationStore.getActiveTheme();
    const items = situationStore.getItemsByTheme(theme);

    contentContainer.innerHTML = "";
    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "meta";
      empty.textContent = "Nessun dato disponibile per questo tema.";
      contentContainer.appendChild(empty);
      return;
    }
    for (const item of items) {
      contentContainer.appendChild(renderItemCard(item, map));
    }
  }

  situationStore.subscribe(render);
  render();
}

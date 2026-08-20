import type { SituationItem, ThemeKey } from "@shared/types";

type Listener = () => void;

class SituationStore {
  private items: SituationItem[] = [];
  private activeTheme: ThemeKey = "hazards";
  private listeners = new Set<Listener>();

  setItems(items: SituationItem[]) {
    this.items = items;
    this.emit();
  }

  addItems(items: SituationItem[]) {
    this.items = [...this.items, ...items];
    this.emit();
  }

  getItems(): SituationItem[] {
    return this.items;
  }

  getItemsByTheme(theme: ThemeKey): SituationItem[] {
    return this.items
      .filter((item) => item.theme === theme)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }

  setActiveTheme(theme: ThemeKey) {
    this.activeTheme = theme;
    this.emit();
  }

  getActiveTheme(): ThemeKey {
    return this.activeTheme;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) listener();
  }
}

export const situationStore = new SituationStore();

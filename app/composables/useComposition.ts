export interface MiddleSection {
  id: string;
  type: string;
  name: string;
}

export interface Theme {
  bg: string;
  surface: string;
  text: string;
  primary: string;
  radius: string;
  stickyNav: boolean;
}

export interface Composition {
  navbar: string | null;
  middle: MiddleSection[];
  footer: string | null;
  theme: Theme;
}

export interface Tab {
  id: string;
  name: string;
  composition: Composition;
}

export interface Workspace {
  tabs: Tab[];
  activeId: string;
  seq: number;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const defaultComposition = (): Composition => ({
  navbar: null,
  middle: [],
  footer: null,
  theme: {
    bg: "#ffffff",
    surface: "#f4f4f5",
    text: "#18181b",
    primary: "#2563eb",
    radius: "0.5rem",
    stickyNav: false,
  },
});

const newTab = (name: string): Tab => ({
  id: uid(),
  name,
  composition: defaultComposition(),
});

const defaultWorkspace = (): Workspace => {
  const first = newTab("Tab 1");
  return { tabs: [first], activeId: first.id, seq: 1 };
};

export function useComposition() {
  const workspace = useState<Workspace>("workspace", defaultWorkspace);

  // There is always at least one tab (removeTab keeps a minimum of one).
  const activeTab = computed<Tab>(() => {
    const { tabs, activeId } = workspace.value;
    return tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  });

  // The active tab's composition — writable, so every existing helper
  // (including reset, which reassigns it) keeps working untouched.
  const composition = computed<Composition>({
    get: () => activeTab.value.composition,
    set: (val) => {
      activeTab.value.composition = val;
    },
  });

  // ---- tab management ----
  const addTab = () => {
    const n = workspace.value.seq + 1;
    workspace.value.seq = n;
    const tab = newTab(`Tab ${n}`);
    workspace.value.tabs.push(tab);
    workspace.value.activeId = tab.id;
  };

  const removeTab = (id: string) => {
    if (workspace.value.tabs.length <= 1) return; // always keep one
    const idx = workspace.value.tabs.findIndex((t) => t.id === id);
    if (idx < 0) return;
    workspace.value.tabs.splice(idx, 1);
    if (workspace.value.activeId === id) {
      workspace.value.activeId = workspace.value.tabs[Math.max(0, idx - 1)]!.id;
    }
  };

  const selectTab = (id: string) => {
    workspace.value.activeId = id;
  };

  const renameTab = (id: string, name: string) => {
    const t = workspace.value.tabs.find((t) => t.id === id);
    if (t) t.name = name.trim() || t.name;
  };

  // ---- composition helpers (unchanged, now act on the active tab) ----
  const setNavbar = (name: string) => {
    composition.value.navbar = composition.value.navbar === name ? null : name;
  };
  const setFooter = (name: string) => {
    composition.value.footer = composition.value.footer === name ? null : name;
  };
  const addSection = (type: string, name: string) => {
    composition.value.middle.push({ id: uid(), type, name });
  };
  const setVariant = (id: string, name: string) => {
    const s = composition.value.middle.find((s) => s.id === id);
    if (s) s.name = name;
  };
  const removeSection = (id: string) => {
    composition.value.middle = composition.value.middle.filter(
      (s) => s.id !== id,
    );
  };
  const moveSection = (id: string, dir: -1 | 1) => {
    const arr = composition.value.middle;
    const i = arr.findIndex((s) => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return;
    const a = arr[i];
    const b = arr[j];
    if (!a || !b) return;
    arr[i] = b;
    arr[j] = a;
  };
  const reset = () => {
    composition.value = defaultComposition();
  };

  const recipe = computed(() => {
    const c = composition.value;
    return [
      `navbar:   ${c.navbar ?? "—"}`,
      `sections:`,
      ...(c.middle.length
        ? c.middle.map((s, i) => `  ${i + 1}. ${s.type}/${s.name}`)
        : ["  —"]),
      `footer:   ${c.footer ?? "—"}`,
      ``,
      `theme:`,
      `  bg       ${c.theme.bg}`,
      `  surface  ${c.theme.surface}`,
      `  text     ${c.theme.text}`,
      `  primary  ${c.theme.primary}`,
      `  radius   ${c.theme.radius}`,
    ].join("\n");
  });

  return {
    workspace,
    composition,
    activeTab,
    addTab,
    removeTab,
    selectTab,
    renameTab,
    setNavbar,
    setFooter,
    addSection,
    setVariant,
    removeSection,
    moveSection,
    reset,
    recipe,
  };
}

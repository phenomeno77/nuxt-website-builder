export interface SectionVariant {
  type: string; // folder name: 'navbar' | 'hero' | 'footer' | ...
  name: string; // file name without extension, e.g. 'NavbarMinimal'
  label: string; // human label shown in the picker, e.g. 'Minimal'
  component: unknown; // the Vue component (markRaw'd)
}

export type SectionRegistry = Record<string, SectionVariant[]>;

let cache: SectionRegistry | null = null;

/**
 * Scans app/components/sections/<type>/<Variant>.vue and builds a map:
 *   { navbar: [...variants], hero: [...], footer: [...] }
 * Add a new variant by dropping a .vue file in the right folder — no wiring.
 */
export function useSectionRegistry(): SectionRegistry {
  if (cache) return cache;

  const modules = import.meta.glob("../components/sections/**/*.vue", {
    eager: true,
  }) as Record<string, { default: unknown }>;

  const registry: SectionRegistry = {};

  for (const path in modules) {
    const match = path.match(/sections\/([^/]+)\/([^/]+)\.vue$/);
    if (!match || !match[1] || !match[2]) continue;

    const type = match[1];
    const name = match[2];
    const label =
      name
        .replace(new RegExp("^" + type, "i"), "") // drop leading type word
        .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
        .trim() || name;

    const mod = modules[path];
    if (!mod || !mod.default) continue;

    (registry[type] ||= []).push({
      type,
      name,
      label,
      component: markRaw(mod.default as object),
    });
  }

  for (const type in registry) {
    const list = registry[type];
    if (list) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  cache = registry;
  return registry;
}

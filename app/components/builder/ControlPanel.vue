<script setup lang="ts">
const registry = useSectionRegistry();

function addFirstOf(type: string) {
  const first = registry[type]?.[0];
  if (first) addSection(type, first.name);
}

const {
  composition,
  setNavbar,
  setFooter,
  addSection,
  setVariant,
  removeSection,
  moveSection,
  reset,
  recipe,
} = useComposition();

const middleTypes = computed(() =>
  Object.keys(registry)
    .filter((t) => t !== "navbar" && t !== "footer")
    .sort(),
);

const copied = ref(false);
async function copyRecipe() {
  try {
    await navigator.clipboard.writeText(recipe.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    /* clipboard blocked — ignore */
  }
}

// Multiple panels open at once → a Set, not a single string.
const open = ref<Set<string>>(new Set(["navbar"]));
function toggle(panel: string) {
  const next = new Set(open.value);
  next.has(panel) ? next.delete(panel) : next.add(panel);
  open.value = next;
}
</script>

<template>
  <div class="p-5 text-sm">
    <!-- Navbar -->
    <section class="border-b border-zinc-100 py-3">
      <button
        class="flex w-full items-center justify-between py-1 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900"
        @click="toggle('navbar')"
      >
        <span>Navbar</span>
        <span class="text-xl leading-none text-zinc-400">{{
          open.has("navbar") ? "−" : "+"
        }}</span>
      </button>
      <div v-show="open.has('navbar')" class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="v in registry.navbar || []"
          :key="v.name"
          class="rounded-md border px-3 py-1.5 text-xs font-medium transition"
          :class="
            composition.navbar === v.name
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-zinc-200 hover:border-zinc-300'
          "
          @click="setNavbar(v.name)"
        >
          {{ v.label }}
        </button>
      </div>
    </section>

    <!-- Sections -->
    <section class="border-b border-zinc-100 py-3">
      <button
        class="flex w-full items-center justify-between py-1 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900"
        @click="toggle('sections')"
      >
        <span>Sections</span>
        <span class="text-xl leading-none text-zinc-400">{{
          open.has("sections") ? "−" : "+"
        }}</span>
      </button>
      <div v-show="open.has('sections')" class="mt-3">
        <ul class="space-y-2">
          <li
            v-for="(s, i) in composition.middle"
            :key="s.id"
            class="flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1.5"
          >
            <span class="w-12 shrink-0 text-[11px] uppercase text-zinc-400">{{
              s.type
            }}</span>
            <select
              class="min-w-0 flex-1 rounded border border-zinc-200 bg-white px-1.5 py-1 text-xs"
              :value="s.name"
              @change="
                setVariant(s.id, ($event.target as HTMLSelectElement).value)
              "
            >
              <option
                v-for="v in registry[s.type]"
                :key="v.name"
                :value="v.name"
              >
                {{ v.label }}
              </option>
            </select>
            <button
              class="px-1 text-zinc-400 disabled:opacity-30"
              :disabled="i === 0"
              @click="moveSection(s.id, -1)"
            >
              ↑
            </button>
            <button
              class="px-1 text-zinc-400 disabled:opacity-30"
              :disabled="i === composition.middle.length - 1"
              @click="moveSection(s.id, 1)"
            >
              ↓
            </button>
            <button
              class="px-1 text-zinc-400 transition hover:text-red-500"
              @click="removeSection(s.id)"
            >
              ✕
            </button>
          </li>
          <li v-if="!composition.middle.length" class="text-xs text-zinc-400">
            No sections yet.
          </li>
        </ul>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="t in middleTypes"
            :key="t"
            class="rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-400"
            @click="addFirstOf(t)"
          >
            + {{ t }}
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section class="border-b border-zinc-100 py-3">
      <button
        class="flex w-full items-center justify-between py-1 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900"
        @click="toggle('footer')"
      >
        <span>Footer</span>
        <span class="text-xl leading-none text-zinc-400">{{
          open.has("footer") ? "−" : "+"
        }}</span>
      </button>
      <div v-show="open.has('footer')" class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="v in registry.footer || []"
          :key="v.name"
          class="rounded-md border px-3 py-1.5 text-xs font-medium transition"
          :class="
            composition.footer === v.name
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-zinc-200 hover:border-zinc-300'
          "
          @click="setFooter(v.name)"
        >
          {{ v.label }}
        </button>
      </div>
    </section>

    <!-- Theme -->
    <section class="border-b border-zinc-100 py-4">
      <h2
        class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400"
      >
        Theme
      </h2>
      <div class="space-y-2">
        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Sticky navbar</span>
          <input
            class="h-5 w-5 cursor-pointer rounded border border-zinc-200"
            type="checkbox"
            v-model="composition.theme.stickyNav"
          />
        </label>

        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Background</span>
          <input
            v-model="composition.theme.bg"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-zinc-200"
          />
        </label>

        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Surface</span>
          <input
            v-model="composition.theme.surface"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-zinc-200"
          />
        </label>
        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Text</span>
          <input
            v-model="composition.theme.text"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-zinc-200"
          />
        </label>
        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Primary</span>
          <input
            v-model="composition.theme.primary"
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-zinc-200"
          />
        </label>
        <label class="flex items-center justify-between">
          <span class="text-xs text-zinc-500">Corner radius</span>
          <select
            v-model="composition.theme.radius"
            class="rounded border border-zinc-200 bg-white px-2 py-1 text-xs"
          >
            <option value="0">Sharp</option>
            <option value="0.5rem">Medium</option>
            <option value="1rem">Round</option>
          </select>
        </label>
      </div>
    </section>

    <!-- Recipe -->
    <section class="py-4">
      <div class="mb-2 flex items-center justify-between">
        <h2
          class="text-xs font-semibold uppercase tracking-wider text-zinc-400"
        >
          Recipe
        </h2>
        <button
          class="text-xs font-medium text-blue-600 transition hover:underline"
          @click="copyRecipe"
        >
          {{ copied ? "Copied" : "Copy" }}
        </button>
      </div>
      <pre
        class="whitespace-pre-wrap rounded-md bg-zinc-900 p-3 text-[11px] leading-relaxed text-zinc-100"
        >{{ recipe }}</pre
      >
      <button
        class="mt-3 text-xs text-zinc-400 transition hover:text-red-500"
        @click="reset"
      >
        Reset composition
      </button>
    </section>
  </div>
</template>

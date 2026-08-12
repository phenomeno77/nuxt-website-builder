<script setup lang="ts">
const { workspace, addTab, removeTab, selectTab, renameTab } = useComposition();
const view = ref<"desktop" | "mobile">("desktop");

// inline double-click-to-rename
const editingId = ref<string | null>(null);
const editingName = ref("");
const vFocus = {
  mounted: (el: HTMLInputElement) => {
    el.focus();
    el.select();
  },
};
function startRename(id: string, name: string) {
  editingId.value = id;
  editingName.value = name;
}

function commitRename() {
  if (editingId.value) renameTab(editingId.value, editingName.value);
  editingId.value = null;
}

// persist the whole workspace (all tabs) now, not a single composition
onMounted(() => {
  const saved = localStorage.getItem("workspace");
  if (saved) {
    try {
      Object.assign(workspace.value, JSON.parse(saved));
    } catch {
      /* corrupt / old data — ignore */
    }
  }
  watch(
    workspace,
    (v) => localStorage.setItem("workspace", JSON.stringify(v)),
    { deep: true },
  );
});
</script>

<template>
  <div class="flex h-screen flex-col bg-zinc-100 text-zinc-900">
    <header class="border-b border-zinc-200 bg-white">
      <div class="flex items-center justify-between px-5 py-3">
        <h1 class="text-sm font-semibold">Website Builder</h1>
        <span class="text-xs text-zinc-400">preview &amp; decide</span>
      </div>

      <div
        class="flex items-center gap-1 overflow-x-auto border-t border-zinc-100 px-3 py-2"
      >
        <div
          v-for="t in workspace.tabs"
          :key="t.id"
          class="group flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition"
          :class="
            workspace.activeId === t.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
          "
        >
          <input
            v-if="editingId === t.id"
            v-model="editingName"
            v-focus
            class="w-20 bg-transparent outline-none"
            @keyup.enter="commitRename"
            @blur="commitRename"
          />
          <button
            v-else
            @click="selectTab(t.id)"
            @dblclick="startRename(t.id, t.name)"
          >
            {{ t.name }}
          </button>
          <button
            v-if="workspace.tabs.length > 1"
            class="opacity-0 transition group-hover:opacity-100 hover:text-red-500"
            :class="
              workspace.activeId === t.id
                ? 'text-zinc-400 opacity-100'
                : 'text-zinc-400'
            "
            @click="removeTab(t.id)"
          >
            ×
          </button>
        </div>

        <button
          class="shrink-0 rounded-md border border-dashed border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700"
          @click="addTab"
        >
          + New tab
        </button>
      </div>
    </header>

    <div class="grid flex-1 grid-cols-[340px_1fr] overflow-hidden">
      <aside class="overflow-y-auto border-r border-zinc-200 bg-white">
        <BuilderControlPanel />
      </aside>

      <main class="overflow-y-auto bg-zinc-200 p-6">
        <div
          class="mx-auto mb-4 flex w-fit gap-1 rounded-lg bg-white p-1 shadow-sm ring-1 ring-zinc-200"
        >
          <button
            class="rounded px-3 py-1 text-xs font-medium transition"
            :class="
              view === 'desktop'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-500 hover:text-zinc-900'
            "
            @click="view = 'desktop'"
          >
            Desktop
          </button>
          <button
            class="rounded px-3 py-1 text-xs font-medium transition"
            :class="
              view === 'mobile'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-500 hover:text-zinc-900'
            "
            @click="view = 'mobile'"
          >
            Mobile
          </button>
        </div>

        <div
          class="@container mx-auto w-full overflow-clip rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 transition-all duration-300"
          :class="view === 'mobile' ? 'max-w-[390px]' : 'max-w-6xl'"
        >
          <BuilderPreviewFrame />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const registry = useSectionRegistry();
const { composition } = useComposition();

function componentFor(type: string, name: string | null) {
  if (!name) return null;
  return registry[type]?.find((v) => v.name === name)?.component ?? null;
}

const themeStyle = computed(() => ({
  "--builder-bg": composition.value.theme.bg,
  "--builder-surface": composition.value.theme.surface,
  "--builder-text": composition.value.theme.text,
  "--builder-primary": composition.value.theme.primary,
  "--builder-radius": composition.value.theme.radius,
}));

const isEmpty = computed(
  () =>
    !composition.value.navbar &&
    composition.value.middle.length === 0 &&
    !composition.value.footer,
);
</script>

<template>
  <div class="min-h-full" :style="themeStyle">
    <div
      v-if="composition.navbar"
      :class="composition.theme.stickyNav ? 'sticky top-0 z-50' : ''"
    >
      <component :is="componentFor('navbar', composition.navbar)" />
    </div>

    <component
      v-for="s in composition.middle"
      :key="s.id"
      :is="componentFor(s.type, s.name)"
    />

    <component
      :is="componentFor('footer', composition.footer)"
      v-if="composition.footer"
    />

    <div
      v-if="isEmpty"
      class="flex min-h-[60vh] items-center justify-center text-sm text-zinc-400"
    >
      Pick sections on the left to start composing.
    </div>
  </div>
</template>

<template>
  <section class="w-full bg-[var(--builder-bg)] text-[var(--builder-text)]">
    <div class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
      <div>
        <p class="mb-4 text-sm font-medium uppercase tracking-widest opacity-60">
          Now in beta
        </p>
        <h1 class="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Build something people remember.
        </h1>
        <p class="mt-5 max-w-md text-lg opacity-70">
          A short supporting line that frames the value without overselling it.
        </p>
        <div class="mt-8 flex gap-3">
          <button
            class="rounded-[var(--builder-radius)] bg-[var(--builder-primary)] px-5 py-3 text-sm font-medium text-white"
          >
            Start free
          </button>
          <button
            class="rounded-[var(--builder-radius)] border border-black/10 px-5 py-3 text-sm font-medium"
          >
            Learn more
          </button>
        </div>
      </div>
      <div class="aspect-[4/3] w-full rounded-[var(--builder-radius)] bg-[var(--builder-surface)]" />
    </div>
  </section>
</template>

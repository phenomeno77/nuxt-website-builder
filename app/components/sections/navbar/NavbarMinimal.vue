<template>
  <header class="w-full border-b border-black/5 bg-[var(--builder-bg)] text-[var(--builder-text)]">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <span class="text-lg font-semibold tracking-tight">Acme</span>
      <nav class="hidden gap-8 text-sm font-medium md:flex">
        <a class="opacity-70 transition hover:opacity-100" href="#">Product</a>
        <a class="opacity-70 transition hover:opacity-100" href="#">Pricing</a>
        <a class="opacity-70 transition hover:opacity-100" href="#">About</a>
      </nav>
      <button
        class="rounded-[var(--builder-radius)] bg-[var(--builder-primary)] px-4 py-2 text-sm font-medium text-white"
      >
        Get started
      </button>
    </div>
  </header>
</template>

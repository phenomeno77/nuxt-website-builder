# Website Builder — walking skeleton

A visual **preview & decide** tool: pick a navbar, stack content sections in
order, pick a footer, tweak the theme, and read off the **recipe** of components
to build your real site with. Nuxt 4 + Tailwind CSS v4.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it fits together

```
app/
  components/
    sections/            ← your library of variants, grouped by type
      navbar/            ← NavbarMinimal.vue, NavbarCentered.vue, ...
      hero/              ← HeroSplit.vue, HeroCentered.vue, ...
      footer/            ← FooterSimple.vue, ...
    builder/
      PreviewFrame.vue   ← renders the composed page with live theme vars
      ControlPanel.vue   ← the pickers, theme controls, recipe
  composables/
    useSectionRegistry.ts ← auto-discovers every variant (no manual wiring)
    useComposition.ts     ← the current selection + recipe output
  pages/
    index.vue            ← two-pane composer
```

## Add a new variant (this is the whole workflow)

1. Drop a `.vue` file in the matching folder, e.g.
   `app/components/sections/hero/HeroMinimal.vue`.
2. That's it — it shows up in the picker automatically.

## The two rules that keep it swappable

1. **Every variant of a type is interchangeable.** Same outer slot, dummy
   placeholder content inside (you're choosing a *look*, not writing copy yet).
2. **Colors come from `var(--builder-*)`**, never hardcoded. That's what lets
   the theme controls re-skin every section instantly. Available vars:
   `--builder-bg`, `--builder-surface`, `--builder-text`, `--builder-primary`,
   `--builder-radius`.

## Add a new SECTION TYPE (e.g. testimonials)

Just create the folder `app/components/sections/testimonials/` and add a
variant. It appears as a `+ testimonials` button in the Sections panel — no
code changes needed.
```

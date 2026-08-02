# Octopus Project Guide

## Project Overview

Octopus is a Russian-language company and project-hub website. It presents a single digital brand that can grow into several independent services, each with its own subdomain after a custom domain is connected.

## Technology

- TanStack Start and React 19
- TanStack Router file-based routing
- TypeScript in strict mode
- Tailwind CSS 4 with a custom global design system
- Vite 7 and the Netlify TanStack Start adapter
- Lucide React for interface icons

## Architecture

```text
public/
  octopus-mark.svg      Brand favicon
src/
  routes/
    __root.tsx          Global document, metadata, and stylesheet
    index.tsx           Main marketing page and page content
  router.tsx            TanStack Router setup
  styles.css            Global tokens, layout, responsive rules, animations
netlify.toml             Netlify build and local development settings
```

## Coding Conventions

- Use functional React components and TypeScript.
- Keep route-level page composition in `src/routes/`.
- Use PascalCase for components and camelCase for variables.
- Use Lucide icons instead of emoji or text-based icon substitutes.
- Keep brand colors and typography in CSS custom properties at the top of `src/styles.css`.
- Build responsive behavior mobile-first when adding new sections.
- Respect `prefers-reduced-motion` for every new animation.
- Keep visible site copy in Russian unless a product specifically requires another language.

## Design Direction

The visual system uses a dark green core, warm off-white surfaces, coral accents, and muted lime highlights. The octopus metaphor should remain structural rather than decorative: one core brand, multiple connected products. Avoid generic gradient-heavy SaaS patterns and equal-card feature grids.

## Adding Services

The service preview data currently lives in `src/routes/index.tsx`. A service can later become a separate Netlify site. With the default Netlify domain, separate sites use separate `*.netlify.app` names. Nested service addresses such as `search.octopus.example` require a custom domain and DNS configuration.

## Commands

- `pnpm dev` starts local development.
- `pnpm build` creates the production build.

Do not commit generated build output or local environment files.

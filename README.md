# Octopus

Octopus is a Russian-language landing page for a small independent digital company. The site acts as the central map for future projects, services, and subservices while presenting them as parts of one recognizable ecosystem.

## What is included

- A distinctive responsive company landing page
- A visual ecosystem map centered on the Octopus brand
- Preview sections for Search, Studio, and Cloud services
- An explanation of how the main site and future service domains fit together
- Accessible navigation, focus states, reduced-motion support, and a mobile menu
- SEO metadata and a custom Octopus favicon

## Technology

- [TanStack Start](https://tanstack.com/start)
- React 19 and TanStack Router
- TypeScript
- Tailwind CSS 4 and custom CSS
- Lucide React icons
- Netlify deployment adapter

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The application runs on the port reported by Vite. When using Netlify CLI locally, use the project Netlify development configuration.

## Production

Netlify uses the settings in `netlify.toml` to build the TanStack Start application and publish `dist/client`.

For future subservices, the default Netlify addresses can be separate site names such as `octopus-search.netlify.app`. Addresses shaped like `search.octopus.example` require a custom domain with the relevant subdomain configured in DNS and Netlify.

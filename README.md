# Restaurant Website

[Live Demo →](https://cascade-and-coast.netlify.app/)

## Overview

A modern, production-ready restaurant experience built with React, TypeScript, Tailwind CSS, and Vite. It features a welcoming landing page, an API-backed menu with robust filtering, and rich location details with embedded Google Maps for Downtown Vancouver.

## Features

- Mobile-first, responsive design with accessible navigation and modals.
- Menu powered by TanStack Query, runtime data validation, and shareable filter state via URL query params.
- Locations grid with actionable contact details and Google Maps embeds for five Downtown Vancouver neighborhoods.
- Strong tooling: ESLint, Prettier, Vitest, React Testing Library, coverage thresholds, and type-safe configuration.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm preview
```

## Testing & Quality

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm coverage
```

Coverage thresholds are enforced via Vitest to maintain confidence in critical utilities and services.

## Design Decisions

- **Routing:** React Router with code-split routes and progressive enhancement via prefetch-on-hover navigation.
- **Data Fetching:** TanStack Query handles retries, caching, and loading states while Zod validates the external API.
- **State Management:** Lightweight Zustand store for modal visibility, keeping UI state isolated and predictable.
- **Normalization:** Deterministic mapping from raw API payloads into curated categories ensuring consistent UI presentation.
- **Styling:** Tailwind-driven component primitives and a bright, coastal-inspired palette balance contrast and warmth while staying accessible.
- **Accessibility & Performance:** Semantic landmarks, keyboard-friendly modals, lazy-loaded images, and skeleton placeholders maintain UX quality across devices.

## Future Improvements

1. Server-side rendering or static generation for improved SEO and faster first paint.
2. Authentication and reservation management integrated with a real backend.
3. Headless CMS integration to empower non-technical staff to manage menu and location content.
4. Internationalization with localized currency formatting and translations.

## License

MIT

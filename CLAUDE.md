# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simpsonspedia is a React 18 encyclopedia app for The Simpsons universe. It fetches data from the public Simpsons API (thesimpsonsapi.com) and provides browsing for characters, episodes, and locations with favorites, search, and theming.

## Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build (tsc -b && vite build)
npm run build:dev  # Development build (vite build --mode development)
npm run lint       # ESLint check
npm run preview    # Preview production build
```

No test framework is configured.

## Architecture

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS + Shadcn/ui (Radix UI) + TanStack Query + React Router 6

**Provider hierarchy** (App.tsx):
`QueryClientProvider → TooltipProvider → BrowserRouter → ScrollToTopOnRouteChange → Routes`

**Routes:** `/` (Index), `/characters`, `/episodes`, `/locations`, `/favorites`, `*` (NotFound)

**Key patterns:**
- API calls are made directly in page components using TanStack Query — no service/repository abstraction layer
- Persistence (favorites, theme preference) uses localStorage via custom hooks (`useFavorites`, `useTheme`)
- Infinite scroll pagination via `useInfiniteScroll` hook (Intersection Observer)
- Global search (Cmd+K) implemented in `GlobalSearch.tsx`
- All UI primitives live in `src/components/ui/` (Shadcn/ui — managed via `components.json`, add new ones with `npx shadcn-ui@latest add <component>`)

**Styling:**
- Tailwind with CSS custom properties (HSL) for theming — defined in `src/index.css`
- Light theme uses Simpsons yellow (#FFD93D) as primary; dark theme uses purple/blue with neon accents
- Dark mode is class-based (`next-themes`)
- `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes
- Custom fonts: Instrument Serif (headings), Inter (body), JetBrains Mono (mono)

**Path alias:** `@/*` maps to `./src/*`

**Code splitting:** Manual vendor chunks in `vite.config.ts` (vendor-react, vendor-ui, vendor-query)

**TypeScript config:** Relaxed — strict mode, noUnusedLocals, noUnusedParameters, and noImplicitAny are all off.

## PWA

The app has PWA support via `public/manifest.json` and `public/sw.js`. The HTML entry point (`index.html`) includes extensive SEO and PWA meta tags.

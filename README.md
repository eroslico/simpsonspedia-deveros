# Simpsonspedia

<div align="center">

**The Ultimate Encyclopedia of The Simpsons Universe**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

[Features](#features) &bull; [Tech Stack](#tech-stack) &bull; [Getting Started](#getting-started) &bull; [Project Structure](#project-structure)

</div>

---

## About

Simpsonspedia is a modern web application for exploring The Simpsons universe. Browse characters, episodes, and locations from Springfield with powerful filtering, a favorites system, global search, and full dark mode support — all powered by [The Simpsons API](https://thesimpsonsapi.com/).

Built with React 18, TypeScript, Tailwind CSS, and Shadcn/ui. Installable as a Progressive Web App.

---

## Features

### Browsing & Discovery
- **Characters** — Browse characters with gender and status filters, infinite scroll pagination
- **Episodes** — Explore episodes with season and episode number filters
- **Locations** — Discover iconic Springfield locations
- **Global Search** — `Ctrl+K` / `Cmd+K` to search across characters, episodes, and locations instantly

### Personalization
- **Favorites** — Save any character, episode, or location to your favorites (persisted in localStorage)
- **Dark Mode** — Light theme with Simpsons yellow primary, dark theme with purple/neon "Springfield at Night" aesthetic

### Technical
- **PWA** — Installable on desktop and mobile with service worker caching
- **Responsive** — Mobile-first design that works on all screen sizes
- **Skeleton Loading** — Smooth loading states with shimmer animations
- **Infinite Scroll** — Content loads progressively as you scroll via Intersection Observer
- **Code Splitting** — Vendor chunks for React, UI components, and TanStack Query

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 with hooks |
| **Language** | TypeScript 5.8 |
| **Build Tool** | Vite 7.2 (SWC) |
| **Styling** | Tailwind CSS 3.4 + CSS custom properties (HSL) |
| **Components** | Shadcn/ui (Radix UI primitives) |
| **Routing** | React Router 6 |
| **Data Fetching** | TanStack React Query 5 |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 + TypeScript ESLint |
| **API** | [The Simpsons API](https://thesimpsonsapi.com/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/eroslico/simpsonspedia.git
cd simpsonspedia

# Install dependencies
npm install

# Start development server (port 8080)
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 8080 |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

No environment variables required — the app uses a public API.

---

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # Shadcn/ui primitives (button, card, dialog, etc.)
│   ├── Navbar.tsx       # Sticky navigation with mobile menu
│   ├── GlobalSearch.tsx # Cmd+K search modal
│   ├── CharacterCard.tsx / CharacterModal.tsx
│   ├── EpisodeCard.tsx  / EpisodeModal.tsx
│   ├── LocationCard.tsx
│   └── ...              # PageHeader, Footer, ThemeToggle, SkeletonCard, etc.
├── hooks/               # Custom hooks
│   ├── useFavorites.ts  # localStorage-based favorites
│   ├── useTheme.ts      # Dark/light theme toggle
│   ├── useInfiniteScroll.ts  # Intersection Observer pagination
│   └── use-mobile.tsx   # Mobile breakpoint detection
├── pages/               # Route pages
│   ├── Index.tsx        # Home / landing page
│   ├── Characters.tsx   # Character browsing with filters
│   ├── Episodes.tsx     # Episode browsing with filters
│   ├── Locations.tsx    # Location browsing
│   ├── Favorites.tsx    # Saved favorites
│   └── NotFound.tsx     # 404 page
├── lib/utils.ts         # cn() utility (clsx + tailwind-merge)
├── App.tsx              # Router and provider setup
├── main.tsx             # Entry point
└── index.css            # Global styles and theme variables
```

---

## Theming

The app uses CSS custom properties in HSL format for a fully themeable design:

- **Light Mode** — Simpsons yellow (`#FFD93D`) primary, sky blue accents, warm aesthetic
- **Dark Mode** — Deep purple/blue backgrounds, neon accent colors

Custom fonts: **Instrument Serif** (headings), **Inter** (body), **JetBrains Mono** (code).

---

## License

This project is for educational and portfolio purposes.

**The Simpsons&trade;** and all related characters are property of **20th Century Fox** and **The Walt Disney Company**.

---

## Acknowledgments

- [The Simpsons API](https://thesimpsonsapi.com/) for the data
- [Shadcn/ui](https://ui.shadcn.com/) for the component library
- [Lucide Icons](https://lucide.dev/) for the icon set

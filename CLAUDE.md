# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

**Double Design Paints (DDP)** is a Next.js 16 website for a luxury architectural coatings brand based in Lagos. Core features: an AI-powered Designer Tool (Gemini 2.5 Pro + Replicate SAM 2), a finish catalogue with discovery quiz, sample-box ordering, and a lookbook.

## Development Commands

```bash
npm run dev          # Dev server on localhost:3000
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint (eslint-config-next)
```

**Dependency installs require `--legacy-peer-deps`** — enforced via `.npmrc`. `next-sanity` and `@sanity/next-loader` declare peer deps for Next 14/15 but the project runs Next 16. Never delete `.npmrc`.

## Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY                    # Gemini 2.5 Pro (Designer Tool analysis)
REPLICATE_API_TOKEN               # SAM 2 segmentation (planned, not yet wired)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY # Clerk auth (installed, not configured)
CLERK_SECRET_KEY
NEXT_PUBLIC_SANITY_PROJECT_ID     # Sanity CMS (schema defined, not initialised)
NEXT_PUBLIC_SANITY_DATASET
```

## Architecture

### Tech Stack
- **Next.js 16.2.6** App Router, React 19
- **Tailwind CSS v4** — configured via `app/globals.css` `@theme {}` block (not `tailwind.config.js`)
- **TypeScript**
- **Zustand 5** — client state, localStorage-persisted
- **Framer Motion 12** — all interactive animations
- **Sanity 3** — schema defined in `sanity/schemas/finish.ts`, studio not initialised
- **Clerk 7** — installed, environment variables missing

### Design System Laws — enforced in code, never override

1. **No rounded corners** — `border-radius: 0 !important` in `app/globals.css:38`
2. **Asymmetric grids** — 7/5 col splits (`lg:col-span-7` / `lg:col-span-5`), never 6/6
3. **Motion-first** — every UI element uses Framer Motion with spring physics
4. **No shadows** — depth through hairline borders (`--color-rule`) and contrast only
   - Exception: the liquid-glass mobile nav uses `box-shadow: inset 0 1px 0 …` for a specular glass-rim highlight — this is acceptable

### Color Tokens (`styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#2F363F` | Body text, dark fills |
| `--color-bone` | `#FFF8E7` | Primary background |
| `--color-chalk` | `#F3E5DC` | Subtle section bg |
| `--color-petra` | `#C5A059` | Brand gold accent |
| `--color-forest` | `#123D26` | Primary brand green, CTAs |
| `--color-rule` | `rgba(47,54,63,0.12)` | All hairline borders |

Dark mode via `[data-theme="dark"]` CSS attribute — no JS required.

### Responsive Design

Breakpoints follow Tailwind defaults (`sm:640 md:768 lg:1024`). All section padding must be fluid — use the pattern `py-20 md:py-28 lg:py-40`, never a bare `py-40`. Horizontal padding uses the fluid custom property `px-[var(--grid-margin)]` which resolves to `clamp(32px, 5vw, 96px)`.

Touch targets on mobile: minimum `min-h-[48px]` on interactive elements.

### Navigation — critical mobile gotcha

`Navigation.tsx` uses `createPortal(mobileMenu, document.body)` to render the mobile drawer. **Do not move the drawer back inside `<nav>`** — the nav has `backdrop-filter: blur(…)` which creates a stacking context that traps `position: fixed` children, making the overlay invisible.

The nav bar itself uses a liquid-glass treatment: low-opacity bone background + `backdrop-blur(28px) saturate(180%)` + an `inset box-shadow` for the glass-rim highlight. Opacity and border intensify on scroll via a `scrolled` state boolean.

### State Management (`lib/store/useStore.ts`)

Zustand store, persisted to `localStorage` as `ddp-storage`:
- `sampleBox` — max 5 finishes; actions: `addToSampleBox`, `removeFromSampleBox`, `clearSampleBox`
- `moodboard` — unlimited; actions: `addToMoodboard`, `removeFromMoodboard`

### Finish Data (`lib/designer/types.ts` + `lib/data/catalog.ts`)

**Single source of truth** for the 24-finish catalogue is the `FINISHES` array in `lib/designer/types.ts`. `lib/data/catalog.ts` imports from it and augments with category images, specs, and per-finish media paths. The Sanity schema mirrors this structure but CMS is not live.

`FinishCategory` values: `'All' | 'Texture' | 'Pearlescent' | 'Stucco' | 'Metallic' | 'Stone & Concrete' | 'Glaze' | 'Polished Plaster'`

### AI Designer API (`app/api/designer/route.ts`)

Rate-limited at 10 req/min per IP (in-memory `Map` — resets on server restart).

Currently only the **Gemini path** is active. The SAM 2 / Replicate path is described in architecture docs but not wired up (`/api/designer/replicate/route.ts` is a stub).

Request: `{ image: string (base64 data URI), objectType: string, colorName: string, clickX?: number, clickY?: number }`

Response: `{ isValidated: boolean, feedback: string, segmentation?: { polygon?, maskUrl?, obstructions?, confidence? } }`

### Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero video, featured finishes, trust rail, PGN endorsement, lookbook teaser |
| `/finishes` | Full catalogue grid with category filter |
| `/finishes/[slug]` | Dynamic finish detail (data from `FINISH_CATALOG`) |
| `/discover` | Full-screen mood quiz → curated finish results |
| `/designer` | AI Designer Tool — upload photo, click surface, visualise paint |
| `/sample-box` | Order up to 5 finish samples |
| `/lookbook` | Editorial chapters |
| `/trade` | Trade programme landing |
| `/showrooms` | Showroom locations |
| `/architectural` | Architectural coatings |

### Key Architectural Notes

- **`/discover` page** uses `fixed inset-0 z-[100]` — it renders as a full-screen overlay above everything including the nav. It manages its own header (Exit / Back / step counter).
- **Tailwind v4 config** lives entirely in `app/globals.css` inside the `@theme {}` block — there is no separate `tailwind.config.js`. Add new design tokens there and re-export via CSS custom properties.
- **`@google/generative-ai`** is the Gemini SDK used in the API route (not the Vertex AI SDK).
- **Media files** with spaces in names are URL-encoded in `src` attributes (e.g. `/videos%20hero/Generated%20Video%20May%2014%2C%202026%20-%2012_11AM.mp4`).

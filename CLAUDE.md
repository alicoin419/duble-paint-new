# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

**Double Design Paints (DDP)** is a Next.js 16 website for a luxury architectural coatings brand based in Lagos. The site features an AI-powered Designer Tool that uses Gemini 2.5 Pro and Replicate's SAM 2 model for visual analysis and paint visualization.

## Development Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Build & Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## Environment Variables

Required variables in `.env.local`:
- `GEMINI_API_KEY` - Google Gemini 2.5 Pro API key (for Designer Tool analysis)
- `REPLICATE_API_TOKEN` - Replicate API token (for SAM 2 segmentation)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth (not yet configured)
- `CLERK_SECRET_KEY` - Clerk auth (not yet configured)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity CMS (not yet configured)
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity CMS (not yet configured)

## Architecture

### Tech Stack
- **Next.js 16.2.6** with App Router (React 19)
- **Tailwind CSS v4** with custom design tokens
- **TypeScript** for type safety
- **Zustand** for client state management (sample box, moodboard)
- **Framer Motion** for animations (Law #1: Motion-first design)
- **Sanity CMS** (schemas defined, not yet connected)
- **Clerk** (installed, not yet configured)

### Design System Laws

The brand follows strict design laws enforced in code:

1. **No Rounded Corners** - `border-radius: 0 !important` globally enforced in `app/globals.css:36`
2. **Asymmetry** - Grid layouts use 7/5 column splits, not symmetric 6/6
3. **Motion-First** - All UI uses Framer Motion animations with custom spring physics
4. **No Shadows** - Depth via hairline borders (`--color-rule`) and color contrast

### Color System

Defined in `styles/tokens.css`:
- `--color-ink` (#0F0F0D) - Primary text/dark
- `--color-bone` (#F5F1EB) - Primary background/light
- `--color-petra` (#C4873A) - Primary brand accent (gold)
- `--color-chalk`, `--color-stone`, `--color-slate` - Neutrals
- `--color-rule` - Hairline border color (rgba opacity)

Dark mode theme switcher via `[data-theme="dark"]` CSS variables.

### State Management

**Zustand store** (`lib/store/useStore.ts`) with persist middleware:
- `sampleBox` - Max 5 finishes, localStorage persisted as `ddp-storage`
- `moodboard` - Unlimited finishes for inspiration boards
- Actions: `addToSampleBox`, `removeFromSampleBox`, `clearSampleBox`, etc.

### API Routes

#### `/api/designer/route.ts` - AI Designer Tool
Dual-mode analysis:
1. **Precision Mode** (with click coordinates): Uses Replicate SAM 2 model for pixel-perfect segmentation
2. **Fallback Mode** (no click): Uses Gemini 2.5 Pro for architectural analysis and polygon segmentation

Rate limiting: 10 requests/minute per IP (in-memory map)

Request body:
```typescript
{
  image: string;        // base64 data URI
  objectType: string;   // "wall", "ceiling", etc.
  colorName: string;    // finish name
  clickX?: number;      // normalized 0-1 (optional)
  clickY?: number;      // normalized 0-1 (optional)
}
```

Response:
```typescript
{
  isValidated: boolean;
  feedback: string;
  segmentation?: {
    polygon?: Array<{x: number, y: number}>;  // Gemini mode
    maskUrl?: string;                          // SAM 2 mode
    obstructions?: Array<Array<{x: number, y: number}>>;
    confidence?: number;
  }
}
```

#### `/api/designer/scan/route.ts` - Image scan endpoint (stub, not yet implemented)
#### `/api/designer/replicate/route.ts` - Direct Replicate/SAM 2 integration (stub, not yet implemented)

**Note**: Despite the architecture docs describing a dual-mode approach, the current `route.ts` implementation only uses Gemini. The SAM 2 / Replicate path is planned but not wired up.

### File Structure

```
app/
├── api/designer/          # AI Designer API endpoints
├── designer/page.tsx      # Designer Tool page
├── discover/page.tsx      # Finish discovery page
├── finishes/[slug]/       # Dynamic finish detail pages
├── sample-box/page.tsx    # Sample box checkout
├── layout.tsx             # Root layout with Navigation + Footer
└── globals.css            # Global styles + Tailwind config

components/
├── designer/
│   └── DesignerTool.tsx   # Main AI Designer component
├── finish/
│   └── TextureMagnifier.tsx  # 4K macro zoom component
├── global/
│   ├── Navigation.tsx     # Main nav with logo
│   └── UtilityBar.tsx     # Top announcement bar
└── home/
    ├── Hero.tsx           # Video hero with Mux player
    └── MarqueeStrip.tsx   # Scrolling finish showcase

lib/
└── store/useStore.ts      # Zustand state management

styles/
├── tokens.css             # Design system variables
└── typography.css         # Font definitions

sanity/
└── schemas/
    └── finish.ts          # Sanity schema for finishes
```

### Sanity CMS Schema

The `finish` document type includes:
- Basic: name, slug, tagline, category
- Media: hero_image, macro_image_4k, hero_video (Mux ID), gallery
- Technical: technical_specs object (surface type, coverage, drying time, etc.)
- Content: application_steps (rich text)

Categories: Texture, Pearlescent, Stucco, Metallic, Stone & Concrete, Glaze, Polished Plaster

### Typography System

Three font families (defined in `styles/typography.css`):
- `--font-display` - Headings (currently Inter as fallback)
- `--font-ui` - UI elements (currently system-ui)
- `--font-mono` - Technical specs (Fira Code fallback)

Font sizes: `--text-hero`, `--text-display`, `--text-title`, `--text-body`, `--text-ui`, `--text-caption`, `--text-spec`

### Key Components

**DesignerTool** (`components/designer/DesignerTool.tsx`):
- Uploads image, analyzes with AI, visualizes paint application
- Supports click-to-target precision mapping
- Integrates with Zustand store for finish selection

**TextureMagnifier** (`components/finish/TextureMagnifier.tsx`):
- Custom spring physics for macro texture zoom
- Uses 4K macro images for detail inspection

**Hero** (`components/home/Hero.tsx`):
- Mux video player with loop + autoplay
- Framer Motion entrance animations

### Additional Libraries

Installed but not yet prominently used / wired up:
- `@dnd-kit/core` - Drag-and-drop (likely for moodboard reordering)
- `algoliasearch` - Search (planned for finish discovery)
- `react-hook-form` + `zod` - Forms and validation (zod already used in API route)
- `sharp` - Image processing (available server-side)
- `lucide-react` - Icon set
- `tailwind-merge` + `clsx` - Class name utilities

## Important Notes

1. **Next.js 16 Breaking Changes**: This version may have API differences from training data. Check `node_modules/next/dist/docs/` for current documentation.

2. **Design Enforcement**: Do not add rounded corners, shadows, or symmetric layouts. These violate the brand laws.

3. **AI Designer Tool**: Uses both Gemini 2.5 Pro (fallback) and SAM 2 (precision mode). Always test with both code paths.

4. **Rate Limiting**: In-memory rate limiting resets on server restart. Consider Redis for production.

5. **Sanity Not Connected**: Schema is defined but CMS is not initialized. Run Sanity setup before using CMS features.

6. **Clerk Not Configured**: Auth package installed but environment variables needed.

7. **Mobile Responsiveness**: Use Tailwind's responsive prefixes. Test at mobile, tablet, desktop breakpoints.

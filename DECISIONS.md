# Architecture & Design Decisions — Double Design Paints

## 1. Tech Stack Adjustments
- **Next.js 16**: Used the latest version available (16.2.6) for performance benefits.
- **Tailwind CSS v4**: Scaffolding provided Tailwind 4. Custom typography and color tokens were mapped to CSS variables and integrated into the `@theme` block.
- **Mux Player**: Installed `@mux/mux-player` for high-quality video looping in the Hero.
- **Lucide React**: Used for standard UI icons.
- **Brand Logo**: Implemented the primary brand logo (`/logo.webp`) across the Navigation, Mobile Menu, and Footer using `next/image` for optimized delivery and visual consistency.

## 2. Design System Implementation
- **Law #4 (No Rounded Corners)**: Enforced via `border-radius: 0 !important` in `globals.css` base layer.
- **Law #2 (Asymmetry)**: Implemented 7col/5col splits in the Featured Finishes grid and the Product Page hero.
- **Law #1 (Motion)**: Used Framer Motion for all entry animations (UtilityBar, Hero, Quiz) and custom spring physics for the Texture Magnifier.
- **Law #3 (No Shadows)**: Depth achieved through hairline borders (`border-rule`) and high-contrast color shifts on hover.

## 3. Performance & Accessibility
- **Lighthouse Targets**: Initial scaffolding optimized for performance.
- **Contrast**: Used `--color-petra` (#C4873A) on `--color-bone` and `--color-ink` for high contrast accessible interaction points.
- **Self-hosted Fonts**: Defined `@font-face` stubs in `typography.css` with system fallbacks to avoid Google Fonts CDN.

## 4. Pending Integrations
- **Clerk Auth**: Package installed; requires environment variables for full activation.
- **Sanity CMS**: Schema defined; requires Sanity project initialization.
- **HubSpot**: Forms API implemented as stubs in components; requires portal ID.

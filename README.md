# Brilliant Art — Agency Website

Official website for **Brilliant Art**, a full-service digital and branding agency empowering ambitious businesses since 2016. The site is built as a luxury, dark-aesthetic experience that reflects the agency's creative positioning.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Pages](#5-pages)
6. [Component Architecture](#6-component-architecture)
7. [Animation System](#7-animation-system)
8. [Public Assets](#8-public-assets)
9. [Setup & Development](#9-setup--development)
10. [Content Status](#10-content-status)
11. [Changelog](#11-changelog)

---

## 1. Project Overview

| Detail | Value |
|---|---|
| Agency | Brilliant Art |
| Founded | 2016 |
| Location | Al Jubeiha, Amman, Jordan |
| Phone | +962 795 271 157 |
| Email | Hello@brilliantartjo.com |
| Site tagline | *Turning Vision Into Creative Power* |

**Positioning**: A full-service digital and branding agency. We blend creativity, code, and content to deliver digital experiences that are bold, beautiful, and built for impact.

**Services offered**: Web Solutions · Brand Development · Digital Marketing · Video Production · Photography · UX/UI Design · Content Writing · Graphics Design

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Animation | GSAP + ScrollTrigger + ScrollToPlugin | ^3.15.0 |
| GSAP React | @gsap/react | ^2.1.2 |
| Smooth scroll | Lenis | ^1.3.23 |
| 3D (legacy) | Three.js | ^0.184.0 |
| Icons | lucide-react | ^1.11.0 |
| Font | Epilogue (Google Fonts) | all weights 100–900 |

### Key architectural decisions

- **App Router** — all pages use Next.js 14 App Router with `'use client'` where GSAP or state is required.
- **GSAP + Lenis bridge** — Lenis drives smooth scrolling; its `raf` is ticked by `gsap.ticker` so both share one RAF loop. `lenis.on('scroll', ScrollTrigger.update)` keeps ScrollTrigger positions accurate.
- **No scroller proxy** — Lenis updates `window.scrollY` natively so ScrollTrigger reads the real position without a proxy.
- **`useGSAP` scoped to section refs** — all GSAP contexts are scoped using `{ scope: sectionRef }`. Cleanup, selector scoping, and context isolation are handled automatically on unmount.
- **`gsap.set` → `gsap.to` pattern** — initial invisible states are set synchronously with `gsap.set` before any ScrollTrigger is registered. This prevents elements from flashing visible if a trigger fires late.
- **Dynamic imports with `ssr: false`** — `PortfolioTeaser` is dynamically imported to prevent SSR for components that depend on `window` dimensions at mount.

---

## 3. Project Structure

```
brilliant-art/
├── public/
│   ├── images/
│   │   ├── logo.webp
│   │   └── portfolio/
│   │       ├── smart-t-shirt-artwork.webp
│   │       ├── crafted-payment-gateway.webp
│   │       ├── wild-code-zem-boxes.webp
│   │       └── floral-business-card.webp
│   └── videos/
│       └── hero.mp4                        # legacy — not currently used
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout: font, metadata, SmoothScrollProvider
│   │   ├── globals.css                     # Global styles, Tailwind base, glass utilities
│   │   ├── page.tsx                        # Home page — composes all home sections
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── portfolio/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                  # Fixed nav, scroll-aware glass, mobile menu
│   │   │   └── Footer.tsx                  # 3-col: brand+contact / nav links / socials
│   │   │
│   │   ├── providers/
│   │   │   └── SmoothScrollProvider.tsx    # Lenis init, GSAP ticker bridge
│   │   │
│   │   ├── sections/home/
│   │   │   ├── Hero.tsx                    # Particle canvas hero + GSAP word reveal
│   │   │   ├── AboutTeaser.tsx             # 2-col: copy + animated stat counters
│   │   │   ├── ServicesTeaser.tsx          # 8-service grid, ScrollTrigger.batch reveal
│   │   │   ├── PortfolioTeaser.tsx         # Expanding cards (6 projects)
│   │   │   ├── ProcessTeaser.tsx           # Scrub-driven interactive timeline
│   │   │   └── ContactTeaser.tsx           # CTA card with staged animation
│   │   │
│   │   ├── three/
│   │   │   └── HeroScene.tsx               # 2D canvas particle physics (replaced Three.js)
│   │   │
│   │   └── ui/
│   │       ├── GlassCard.tsx               # glass-card wrapper with optional glow
│   │       ├── GradientButton.tsx          # Violet→cyan pill CTA (Link or button)
│   │       ├── GhostButton.tsx             # Outline pill button
│   │       ├── SectionLabel.tsx            # Small pill eyebrow label
│   │       ├── AnimatedCounter.tsx         # Count-up number on scroll
│   │       └── ExpandingCards.tsx          # Interactive expanding card grid
│   │
│   ├── lib/
│   │   ├── gsap.ts                         # Registers ScrollTrigger + ScrollToPlugin
│   │   └── utils.ts                        # cn() — clsx + tailwind-merge
│   │
│   └── hooks/
│       └── useIsomorphicLayoutEffect.ts    # SSR-safe layout effect
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Design System

### Color Tokens (`tailwind.config.ts`)

| Token | Hex | Usage |
|---|---|---|
| `void` | `#0a0a0c` | Page background, hero canvas fill |
| `surface` | `#131315` | Default card/panel surface |
| `surface-dim` | `#0e0e10` | Footer, dimmer panels |
| `surface-low` | `#1c1b1d` | Subtle elevated surfaces |
| `surface-container` | `#201f21` | Input backgrounds |
| `surface-high` | `#2a2a2c` | Higher elevation |
| `surface-highest` | `#353437` | Highest elevation |
| `violet` | `#7c3aed` | Primary brand accent |
| `violet-light` | `#d2bbff` | Light violet — labels, icons |
| `violet-dark` | `#5a00c6` | Hover states |
| `violet-dim` | `#3f008e` | Deep violet |
| `cyan` | `#06b6d4` | Secondary brand accent |
| `cyan-light` | `#4cd7f6` | Light cyan |
| `cyan-dark` | `#003640` | Deep cyan |
| `on-surface` | `#e5e1e4` | Primary text |
| `on-surface-variant` | `#ccc3d8` | Secondary text, labels |
| `outline` | `#958da1` | Borders |
| `outline-variant` | `#4a4455` | Subtle borders |

### Typography

Font: **Epilogue** (Google Fonts, all weights 100–900, CSS variable `--font-epilogue`)

| Token | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|
| `display-xl` | 80px | 1.05 | -0.04em | 700 |
| `display-lg` | 64px | 1.10 | -0.03em | 600 |
| `headline` | 48px | 1.20 | -0.02em | 600 |
| `headline-md` | 32px | 1.30 | -0.01em | 500 |
| `body-lg` | 18px | 1.60 | — | 400 |
| `body-md` | 16px | 1.60 | — | 400 |
| `label-bold` | 14px | 1.40 | 0.06em | 600 |
| `label-sm` | 12px | 1.40 | 0.08em | 500 |

### Spacing Tokens

| Token | Value | Usage |
|---|---|---|
| `section` | 7.5rem (120px) | Standard vertical section padding (`py-section`) |
| `outer` | 4rem | Outer horizontal padding |

### Glass Utilities (defined in `globals.css`)

| Class | Description |
|---|---|
| `glass` | Translucent surface — `backdrop-blur-glass` + semi-transparent bg |
| `glass-card` | Full card: glass + `border-white/8` + `rounded-card` |
| `glass-top` | Nav-style glass — stronger blur for fixed/sticky elements |
| `gradient-pill` | Violet→cyan gradient background for primary CTAs |
| `text-gradient` | `bg-clip-text` gradient text (violet-light → cyan-light) |

### Shadow / Glow Tokens

| Token | Value |
|---|---|
| `shadow-glow-violet` | `0 0 80px -10px rgba(124,58,237,0.5)` |
| `shadow-glow-cyan` | `0 0 80px -10px rgba(6,182,212,0.4)` |
| `shadow-glow-violet-sm` | Smaller violet glow |
| `shadow-glow-cyan-sm` | Smaller cyan glow |
| `shadow-glass` | `0 8px 32px rgba(0,0,0,0.4)` |

---

## 5. Pages

### `/` — Home

Section render order:

| # | Section | Component |
|---|---|---|
| 1 | Hero | `Hero.tsx` + `HeroScene.tsx` |
| 2 | About | `AboutTeaser.tsx` |
| 3 | Services | `ServicesTeaser.tsx` |
| 4 | Portfolio | `PortfolioTeaser.tsx` (dynamic, ssr:false) |
| 5 | Process | `ProcessTeaser.tsx` |
| 6 | Contact CTA | `ContactTeaser.tsx` |
| 7 | Footer | `Footer.tsx` |

### `/about`

- Hero headline with SectionLabel eyebrow
- Stats bar: 10+ years · 200+ projects · 45+ brands · 3 continents (AnimatedCounter)
- Story section (left narrative copy, right brand values grid — 4 values)
- Team grid: 4 members (3 placeholders pending bios/photos)
- CTA banner → `/contact`

### `/services`

- Hero headline
- 6-service list layout (number · title · tagline · description · deliverables list)
- CTA banner → `/contact`

> Note: services page lists 6 services from the initial design. The home ServicesTeaser shows the 8 real services. Reconcile when full copy is ready.

### `/portfolio`

- Hero headline
- Category filter bar: All · Campaign · Identity · Web Experience · 3D / Motion · Strategy
- Filterable 3-column grid; filter change re-animates cards via GSAP
- Each card: gradient thumbnail placeholder, category badge, year, title, description
- CTA banner → `/contact`

> Note: portfolio page contains placeholder project data. Update with real projects and photography when available.

### `/contact`

- Hero headline
- Left column: contact info card (email, phone, location) + social links card
- Right column: project inquiry form (name · email · service select · message)
- Client-side success state after submit (no backend connected yet)

---

## 6. Component Architecture

### `Navbar`

- `position: fixed`, `z-50`
- Transparent at top → `glass-top` + violet drop shadow after 80px scroll (ScrollTrigger)
- Desktop: logo + 4 nav links + "Start a Project" gradient CTA
- Mobile: hamburger → full-screen glass overlay menu with crossfade
- Entrance: slides from `y: -24, opacity: 0` on page load

### `Footer`

Three-column layout:

1. **Brand column** — logo, agency tagline, address (Al Jubeiha, Amman), phone, email
2. **Navigation** — Home · About · Services · Portfolio · Blog · Career · Contact
3. **Follow Us** — Facebook · Instagram · LinkedIn · X / Twitter · YouTube

### `SmoothScrollProvider`

```typescript
const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)
requestAnimationFrame(() => ScrollTrigger.refresh())
```

### `HeroScene` — Canvas Particle System

File: `src/components/three/HeroScene.tsx`

Replaces the original Three.js glass orbs with a pure 2D `<canvas>` physics simulation.

**Render layers (bottom → top):**

1. `#0a0a0c` void fill
2. Violet radial glow — pulsates at `sin(t × 0.0008)`, anchored left-center
3. Cyan radial glow — pulsates at `cos(t × 0.0006)`, anchored right
4. Background star particles — drift slowly, wrap-around, twinkle via sine phase offset
5. Foreground physics particles — spring return + mouse repulsion + elastic collisions

**Physics constants:**

| Constant | Value |
|---|---|
| Particle density | `0.00010` per px² |
| BG star density | `0.000035` per px² |
| Mouse radius | 180px |
| Return speed (spring) | 0.08 |
| Damping | 0.90 |
| Repulsion strength | 1.2 |

**Color distribution**: ~84% white · ~8% violet `#7c3aed` · ~8% cyan `#06b6d4`

**Mouse tracking**: window-level `mousemove` listener so particles respond to cursor position even when hovering over text or buttons layered above the canvas.

**DPR handling**: uses `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` on every resize instead of `ctx.scale()` to prevent compounding transforms.

### `ExpandingCards`

File: `src/components/ui/ExpandingCards.tsx`

Interactive card grid — one card expanded at a time via hover, focus, or click.

```typescript
export interface CardItem {
  id: string | number
  title: string
  description: string
  imgSrc?: string    // optional; falls back to accent radial gradient
  accent?: string    // drives gradient fallback + icon color tint
  icon: React.ReactNode
  linkHref?: string
}
```

**Expansion mechanism**: CSS grid with `gridTemplateColumns` transitioning between `5fr : 1fr : 1fr...` (desktop) or `gridTemplateRows` (mobile `< 768px`). Duration: `500ms ease-out`.

**Collapsed state**: rotated title label (11px, 0.14em tracking, desktop only)

**Active state**: icon → title → description fade in with `delay: 75ms / 150ms / 225ms`

**Missing images**: when `imgSrc` is absent, renders `radial-gradient(ellipse, accent×55%, transparent, #0e0e10)` as the card background.

---

## 7. Animation System

### Initialization Flow

```
SmoothScrollProvider (mounts once in RootLayout)
  ├── new Lenis({ duration: 1.2, smoothWheel: true })
  ├── gsap.ticker.add(lenis.raf)          ← single RAF loop
  ├── lenis.on('scroll', ScrollTrigger.update)
  └── requestAnimationFrame(ScrollTrigger.refresh)

Each section component (useGSAP + scope)
  ├── gsap.set(els, initialState)         ← synchronous, reliable
  └── gsap.to(els, { scrollTrigger: { once: true } })
```

### Pattern: `gsap.set` + `gsap.to` (not `gsap.from`)

`gsap.from()` sets the starting state when the tween is created. If a ScrollTrigger fires late or fails (due to layout shifts), elements stay stuck at their invisible `from` state. The `gsap.set` + `gsap.to` pattern guarantees the initial state is applied synchronously at call time, and ScrollTrigger only needs to drive toward the final state.

### `ScrollTrigger.batch` (ServicesTeaser)

Used for the 8-service card grid. Groups multiple elements entering the viewport into a single callback, animates them as a coordinated batch with `stagger: 0.10`. More robust than individual triggers for grid layouts.

### Scrubbed Timeline Pattern (ProcessTeaser)

The only section using bidirectional scroll-scrub:

```typescript
const tl = gsap.timeline()

// Spine draws linearly the full timeline length
tl.to(spine, { scaleY: 1, ease: 'none', duration: 1 }, 0)

// Glowing tip travels with the spine's tip
tl.to(spineTip, { y: containerH - 10, ease: 'none', duration: 1 }, 0)

// Steps appear at calibrated offsets
// offset chosen so card reveals when spine tip reaches that step's dot
const offsets = [0.06, 0.30, 0.54, 0.78]
offsets.forEach((t, i) => {
  tl.to(dots[i],  { autoAlpha: 1, scale: 1, ease: 'back.out(2.8)' }, t)
  tl.to(cards[i], { autoAlpha: 1, x: 0, scale: 1, ease: 'power3.out' }, t + 0.02)
  tl.to(nums[i],  { autoAlpha: 1 }, t + 0.04)
  tl.to(lines[i], { scaleX: 1, ease: 'power2.out' }, t + 0.06)
})

ScrollTrigger.create({
  trigger: stepsRef.current,
  start: 'top 75%',
  end: 'bottom 25%',
  scrub: 0.8,
  animation: tl,
  invalidateOnRefresh: true,
})
```

### Section Animation Reference

| Section | Technique | Direction | Reversible |
|---|---|---|---|
| Hero | GSAP timeline, clip-based word reveal | on load | no |
| About | `gsap.set` + `gsap.to`, `once: true` | scroll down | no |
| Services | `ScrollTrigger.batch`, `once: true` | scroll down | no |
| Portfolio | CSS grid transitions | hover/click | yes |
| Process | Single scrubbed timeline | scroll both | yes |
| ContactTeaser | GSAP timeline, `once: true` | scroll down | no |

---

## 8. Public Assets

### Current

```
public/images/logo.webp                           — agency logo (navbar + footer)
public/images/portfolio/smart-t-shirt-artwork.webp
public/images/portfolio/crafted-payment-gateway.webp
public/images/portfolio/wild-code-zem-boxes.webp
public/images/portfolio/floral-business-card.webp
public/videos/hero.mp4                            — legacy, not in use
```

### Awaiting (gradient placeholders shown)

| Filename | Used in |
|---|---|
| `public/images/portfolio/colyfate-font-design.webp` | PortfolioTeaser item 5 |
| `public/images/portfolio/watch-mockup-design.webp` | PortfolioTeaser item 6 |

**To add a missing image**: drop the file into `public/images/portfolio/` then add `imgSrc: '/images/portfolio/filename.webp'` to the matching entry in `src/components/sections/home/PortfolioTeaser.tsx`.

---

## 9. Setup & Development

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
# → http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

### Type check

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

### Environment variables

No `.env` required for the current setup. When a form backend is connected:

```env
NEXT_PUBLIC_FORM_ENDPOINT=https://your-endpoint.com
```

---

## 10. Content Status

| Location | Status | Notes |
|---|---|---|
| Home — Hero | ✅ Complete | "Turning Vision Into Creative Power" |
| Home — About | ✅ Complete | Real agency copy since 2016 |
| Home — Services | ✅ Complete | 8 real services with descriptions |
| Home — Portfolio | ✅ 4/6 images | Items 5–6 use gradient placeholders |
| Home — Process | ✅ Complete | 4 official steps |
| Home — Contact CTA | ✅ Complete | "Have a project in mind?" |
| Footer | ✅ Complete | Real address, phone, email, socials |
| `/about` — Story | ⚠️ Placeholder | Awaiting full narrative copy |
| `/about` — Team | ⚠️ Partial | 3 of 4 members unnamed; photos needed |
| `/services` | ⚠️ Placeholder | Descriptions say "to be provided" |
| `/portfolio` | ⚠️ Placeholder | Fictitious projects; awaiting real data |
| `/contact` | ⚠️ Partial | Email/phone are placeholders; form has no backend |

---

## 11. Changelog

### 2026-04-28 — Interactive Process Timeline

- **ProcessTeaser** completely rewritten with a single scrubbed master timeline
- All elements (spine, glowing tip, dots, cards, separator lines) driven by one `ScrollTrigger` with `scrub: 0.8`
- Animations are fully bidirectional — scrub forward on scroll-down, reverse on scroll-up
- Glowing tip dot (`data-spine-tip`) travels with the spine's drawing edge in perfect sync
- Separator lines inside each card (`data-step-line`) animate `scaleX: 0 → 1` as part of the sequence
- Step offsets `[0.06, 0.30, 0.54, 0.78]` calibrated to when the spine tip visually reaches each dot

### 2026-04-28 — Portfolio Expanding Cards

- **PortfolioTeaser** replaced horizontal GSAP pin+scrub scroll with **ExpandingCards** component
- New `src/components/ui/ExpandingCards.tsx` — brand-adapted (optional `imgSrc`, `accent` gradient fallback, `rounded-xl`, dark overlays)
- Portfolio expanded from 4 → 6 projects (Colyfate Font Design + Watch Mockup Design added)
- Cards full-width, matching all other sections' `max-w-[1440px]` container
- `lucide-react` installed

### 2026-04-28 — Portfolio Real Images

- 4 webp images copied from Downloads to `public/images/portfolio/`
- PortfolioTeaser: gradient-only backgrounds replaced with `<Image fill object-cover>` + layered dark gradient + accent radial tint
- First card gets `priority` prop for eager preload

### 2026-04-28 — Content Update from Old HTML

- **AboutTeaser**: years stat 8+ → 10+; paragraphs replaced with official agency copy
- **ServicesTeaser**: 6 placeholder services → 8 real services with accurate descriptions
- **PortfolioTeaser**: 5 fictitious projects → 6 real portfolio titles
- **ProcessTeaser**: step names updated to official process (Strategy & Research, Creative Definition, Design & Production, Evaluation & Reach)
- **ContactTeaser**: "Have a project in mind? Let's work together."
- **Footer**: tagline, navigation links, social links, and contact info all updated to real values

### 2026-04-28 — Scroll Animations Overhaul

- **ServicesTeaser bug fixed**: `gsap.from` was leaving cards permanently invisible when ScrollTrigger failed to fire; replaced with `gsap.set` + `gsap.to` + `ScrollTrigger.batch`
- **ProcessTeaser**: spine scrub + per-step card slide-in + dot bounce-in (`back.out(2.2)`)
- **ContactTeaser**: card lands with scale + y; inner content staggers (label → headline lines → body → buttons)
- **ServicesTeaser, ProcessTeaser, ContactTeaser** all receive coordinated header reveal (label → h2 → subtext stagger)

### 2026-04-28 — Hero Particle Canvas

- **HeroScene.tsx** rewritten: Three.js glass orbs replaced with 2D canvas particle simulation
  - Brand colors: violet + cyan + white particles; spring physics; mouse repulsion; elastic collisions
  - Dual pulsating radial glows; drifting twinkling background stars
  - DPR-correct with `ctx.setTransform`; window-level mouse tracking through text overlays
- **Hero.tsx**: video background removed; canvas is the sole background; `cursor-crosshair`; `bg-void` prevents flash before hydration

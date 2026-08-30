# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-08-28
- Primary product surfaces: Astro single-page KOSSCCHTHON information site
- Evidence reviewed: `README.md`, `src/layouts/Layout.astro`, `src/components/home-page/HomePage.astro`, `src/components/home-page/sections/*.astro`, `src/assets/background.svg`, `src/assets/temp-poster.png`, `/home/minwoo/KakaoTalk/Downloads/현수막.svg`, user-provided poster references

## Brand
- Personality: confident, technical, student-friendly, event-ready
- Trust signals: three-university collaboration, exact date/place, organizer email, judging and prize details
- Avoid: fake application URLs, stale 2026 spring content, dense fixed-pixel poster-only layouts

## Product goals
- Goals: communicate KOSSCCHTHON 2026 event facts clearly and drive students toward the application QR/Google Form flow once available
- Non-goals: full registration handling, QR decoding, payment, team management, or live schedule operations
- Success signals: users can identify eligibility, timeline, venue, judging criteria, prizes, and contact without needing poster images

## Personas and jobs
- Primary personas: students from 국민대학교, 숭실대학교, 순천향대학교
- User jobs: confirm eligibility, understand the event format, prepare for individual application, check dates and contact route
- Key contexts of use: mobile poster link sharing, desktop event-page viewing, quick scanning before submitting a Google Form

## Information architecture
- Primary navigation: vertical single-page flow
- Core routes/screens: `/`
- Content hierarchy: hero, overview, participation flow, schedule, judging/prizes, application/contact

## Design principles
- Principle 1: poster-inspired, but text-first and accessible
- Principle 2: compact scan blocks for dates and requirements
- Tradeoffs: keep the dark blue glass visual language while allowing lighter accent colors for readability and hierarchy

## Visual language
- Color: deep navy base with electric blue accents, white text, cyan highlights, restrained warm accent for prize emphasis
- Typography: system Korean sans-serif stack; large event title only in hero, tighter headings in sections
- Spacing/layout rhythm: centered max-width containers, responsive grids, no fixed-width content blocks
- Shape/radius/elevation: glass panels and chips with rounded corners, subtle neon borders and soft shadows
- Motion: minimal; scroll controller already owns section transitions
- Imagery/iconography: connected event banner asset plus simple CSS badges and symbols

## Components
- Existing components to reuse: `HomePage`, `SectionLayout`, section components under `src/components/home-page/sections`
- New/changed components: all active home sections refreshed for 2026 KOSSCCHTHON content
- Variants and states: unavailable application link uses disabled/notice styling instead of a fake URL
- Token/component ownership: section-local CSS variables in `SectionLayout` and page-level global font/background in `HomePage`

## Accessibility
- Target standard: readable semantic HTML with strong contrast and descriptive labels
- Keyboard/focus behavior: real links only when destinations exist; disabled informational elements are not fake buttons
- Contrast/readability: high-contrast text on dark panels; muted text remains above decorative priority
- Screen-reader semantics: sections, headings, lists, `dl`, `time`, and `address` used where appropriate
- Reduced motion and sensory considerations: no required animation for comprehension

## Responsive behavior
- Supported breakpoints/devices: mobile, tablet, desktop
- Layout adaptations: grids collapse to one column; timeline and info rows stack naturally
- Touch/hover differences: hover decoration is optional; content remains available without hover

## Interaction states
- Loading: static page, no loading state required
- Empty: application URL unknown, so show a prepared/QR 안내 state
- Error: not applicable for static content
- Success: not applicable for static content
- Disabled: Google Form link shown as 준비 중 until URL is supplied
- Offline/slow network, if applicable: core text renders without external assets

## Content voice
- Tone: clear, direct, polished Korean event 안내
- Terminology: KOSSCCHTHON, 2026 연합 경진대회, 무박 2일 현장 해커톤, KIRO 크레딧
- Microcopy rules: do not invent links; mark unknown registration destination plainly

## Implementation constraints
- Framework/styling system: Astro components with scoped CSS
- Design-token constraints: no new dependency; keep repo-native CSS
- Performance constraints: SVG banner is optional visual support, not the only content source
- Compatibility constraints: avoid fixed pixel widths and inline style tables
- Test/screenshot expectations: run Astro build/check; use browser screenshot if local dev server is started

## Open questions
- [ ] Google Form / QR destination URL / organizer / needed before enabling a live application CTA

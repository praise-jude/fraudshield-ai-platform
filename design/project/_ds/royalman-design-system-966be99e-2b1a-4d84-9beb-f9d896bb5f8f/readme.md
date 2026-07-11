# Royalman Design System

A design system for **ROYALMAN DIGITAL CONCEPT** (Royalman Digital Concept / Royalman Web Agency) —
a web-design agency based in Abuja, Nigeria that builds "custom-fit," conversion-focused websites
for small businesses and startups.

> **Tagline:** *Quality and Affordable Web Development For You.*
> **Positioning:** *"Get a custom-fit website that puts you ahead of your competitors, designed with precision to reflect your unique brand."*

This system was reverse-engineered from the agency's live React + Tailwind marketing site.

## Sources used
- **Primary (ground truth):** `royalman-global/Royalman-official-website` — the official Royalman
  website (React + Vite + Tailwind). Colors, fonts, layouts, copy and components here are lifted
  directly from this repo. → https://github.com/royalman-global/Royalman-official-website
- The user-referenced `praise-jude/ROYALMAN-WEB` repo was **empty** (no commits) at build time, so
  the official-website repo above was used as the authoritative source.
- Related brand repos (not used, for reference): `royalman-global/Afrika-En-Vogue`,
  `praise-jude/Inventra`, `praise-jude/Royalman-inventory-`.

Readers with access should explore the official-website repo to build higher-fidelity designs.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (import this one file). `@import`s all tokens + fonts.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skill wrapper.

**tokens/**
- `colors.css` — brand, neutral, accent, semantic color tokens.
- `typography.css` — Poppins family, weights, type scale, roles.
- `spacing.css` — spacing scale, gutters, radii, shadows, motion.
- `fonts.css` — Poppins webfont (Google Fonts).

**guidelines/** (foundation specimen cards)
- Color: Brand, Neutrals, Accent Icons · Type: Display & Headings, Body & Eyebrow ·
  Spacing: Radii & Shadows, Spacing Scale · Brand: Logo.

**components/** — reusable primitives (see below).

**ui_kits/website/** — interactive recreation of the Royalman marketing site.

### Components
Grounded 1:1 in the site's repeated UI patterns.
- **core/** — `Button`, `Card`, `SectionHeading`, `Input`
- **marketing/** — `FeatureItem`, `PriceCard`, `Testimonial`, `FAQItem`, `StepItem`

> **Note on inventory:** The source is a Tailwind marketing site with no formal component library,
> so these primitives were extracted from the patterns that recur across the real pages (CTA
> buttons, shadow cards, section headings, pricing tiers, testimonials, FAQ rows, process steps,
> feature blocks, the newsletter input). No primitives were invented beyond what the site uses.

---

## CONTENT FUNDAMENTALS

**Voice.** Direct, benefit-led, and persuasive — classic conversion copywriting. The site is one
long sales argument: agitate the problem, present the solution, prove it, remove risk, then ask
for the sale.

**Person.** Second person throughout — **"you" / "your"** for the customer, **"we" / "our"** for
Royalman. Example: *"We're confident **you'll** love **your** new website."* / *"**We** stand by
**our** work."*

**Casing.** Section headings frequently use **Title Case** ("Find the Perfect Package for Your
Business", "Book Your Free 10-Minute Consultation"). Body copy is sentence case.

**Structure & tone markers:**
- **Urgency & scarcity** — "Attention Business Owners!", countdown timers, "limited-time".
- **Concrete numbers** — "130% Increase in Conversion", "40% More Traffic", "30-Day Money-Back
  Guarantee", "70% deposit", package prices ($500 / $700 / $1000).
- **Risk reversal** — money-back guarantee repeated; "no questions asked", "Risk-Free".
- **Imperative CTAs** — "Start Your Order", "Book Your Free Consultation", "Choose Professional".
- **Em dashes & ellipses** for rhetorical pauses — *"Or Your Money Back!"*, *"Don't Just Take Our
  Word for It…"*.

**Emoji:** none. The brand does not use emoji. Emphasis comes from **bold** lead-ins and colored
icons, not emoji.

**Vibe:** professional, confident, approachable, and hungry for the customer's business — a small
agency punching above its weight.

---

## VISUAL FOUNDATIONS

**Colors.** Two brand colors do all the heavy lifting:
- **Orange `#FF9300` (brandOne)** — the primary. Every CTA, link, accent icon, and highlight.
- **Royal Blue `#000F9A` (brandTwo)** — the secondary and the *hover state for orange* (buttons
  swap orange → blue on hover). Also used for problem-list icons.
Neutrals are the Tailwind gray scale (gray-100 section backgrounds, gray-600 body, gray-800
headings, gray-950 footer bar). A rainbow of Tailwind accent colors (blue/green/yellow/red/purple)
appears **only** as decorative icon tints in the Steps, Packages, and FAQ lists.

**Type.** A single family — **Poppins** — across everything. Headings are **bold (700) to extrabold
(800)**; body is regular (400). Big, confident display headings (up to ~45px) with tight leading;
relaxed 1.65 line-height on body prose.

**Backgrounds.** Two treatments dominate:
1. **Full-bleed photographic hero/footer images** (hosted on Cloudinary) with a heavy **black
   scrim at ~82–85% opacity** so white text stays legible. This is the signature look.
2. **Flat gray-100 section bands** alternating with white sections for rhythm.
One **linear gradient** exists — blue → orange — on the About page "Why Choose Us" band (with
white 10%-opacity glass cards on top).

**Cards.** White background, `rounded-lg` (8px) corners, **`shadow-lg`**, usually a **1px gray-200
border**, `p-6` (24px) padding. This is the universal container. No neumorphism, no heavy gradients.

**Buttons.** Two shapes: `rounded-lg` (nav "Free Quote") and `rounded-full` pills (section CTAs).
Orange fill, bold white text. **Hover:** background fills royal blue; primary CTAs also **scale up
~5%** (`hover:scale-105`) with a shadow. No press-shrink.

**Radii.** sm 4px · lg 8px (cards, quote button) · xl 12px (inputs, newsletter) · full 9999px (CTAs).

**Shadows.** Tailwind `shadow-md` / `shadow-lg` / `shadow-xl`. Soft, neutral, no colored glows.

**Motion.** Restrained. Color/transform transitions at **300ms**; the header background cross-fades
over **700ms** on scroll. One `animate-pulse` on the hero eyebrow. Standard ease. No bounces, no
parallax, no scroll-jacking.

**Hover states.** Links and nav go **orange**; buttons go **blue**; cards can lift (translateY) with
a deeper shadow. **Transparency & blur:** black/white opacity scrims over hero/footer images
(`bg-opacity-85`) and 10%-white glass cards on the gradient band — no backdrop-blur.

**Imagery vibe.** Warm, real, business-oriented stock/brand photography, always darkened under a
scrim so it reads as a textured background rather than a focal image.

**Layout.** Centered, single-column, generous vertical rhythm. Content is capped
(`max-w-3xl`/`4xl` prose ~768px, `max-w-6xl` grids ~1152px) and centered with page gutters that
grow `px-5 → px-10 → px-20`. Sticky header fixed to the top.

---

## ICONOGRAPHY

The site uses **`react-icons`**, specifically the **Font Awesome** sets (`react-icons/fa` and
`react-icons/fa6`). Icons are rendered as inline font glyphs, tinted with brand or accent colors
and sized generously (24–80px in feature areas).

- **Family:** Font Awesome (solid + brands). Examples in use: `FaGlobe`, `FaShoppingCart`,
  `FaMobileAlt`, `FaRocket`, `FaChartLine`, `FaLaptopCode`, `FaCheckCircle`, `FaQuoteLeft/Right`,
  `FaWhatsapp`, `FaFacebookF`, `FaLinkedin`, `FaInstagram`, `FaXTwitter`, `FaPhoneAlt`, `MdEmail`.
- **Color usage:** brand **orange** for most functional/social icons; **royal blue** for
  problem-list icons; the Tailwind accent rainbow for decorative Steps/Packages/FAQ icons.
- **Emoji:** never used. **Unicode chars:** only a plain check "✓" as a list bullet in cards.
- **No custom SVG icon set** and no icon sprite ships in the repo — everything comes from Font
  Awesome via react-icons.

**In this design system**, cards and UI kits load **Font Awesome 6 from CDN**
(`cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2`), which is the exact same glyph family as
`react-icons/fa`. Components that render icons accept an `icon` prop (a React node) so consumers pass
whatever glyph they need.

---

## Assets & caveats

- **Logo & imagery** (logo, hero/footer/about/blog backgrounds) live on the brand's **Cloudinary
  CDN** and are referenced by URL — they could not be downloaded into `assets/` from this
  environment (cross-origin fetch is blocked in the sandbox). The `guidelines/brand-logo.card.html`
  and UI kit reference these public URLs directly. **If you want them vendored locally, please
  download and drop them into `assets/`** (URLs are in `guidelines/brand-logo.card.html`,
  `ui_kits/website/*.jsx`).
- **Font:** Poppins is the brand's real typeface and loads from Google Fonts — **no substitution**.

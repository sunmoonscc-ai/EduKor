---
name: Hannuri EdTech
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#280c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#481b00'
  on-tertiary-container: '#eb6905'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  hangul-display:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  hangul-title:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system establishes a high-performance, contemporary Korean educational environment engineered for focused learning, structural clarity, and sustained student engagement. The aesthetic merges institutional authority with modern mobile software craft.

### Brand Personality & Emotional Intent
- **Authoritative & Trustworthy:** Anchored in deep slate navy and vibrant royal blue to project institutional rigor and linguistic precision.
- **Empowering & Rewarding:** Energetic persimmon accents and jade emerald markers highlight streaks, milestones, and active progress without gamifying the platform into distraction.
- **Clean & Focused:** Restrained visual noise with warm slate surfaces and crisp white cards designed to make Hangul characters immediately legible.

### Design Style: Modern Structural Depth
The platform embraces a refined modern card aesthetic featuring:
- Layered white card modules sitting above subtle slate-tinted canvas backdrops.
- 16px to 20px primary corner radii with micro-badges and rounded pill indicators.
- Soft ambient shadows tinted with slate-navy undertones to create natural optical separation rather than stark cutouts.
- Touch targets optimized strictly for one-handed thumb reach and bilingual phonetic clarity.

## Colors

The palette balances formal linguistic mastery with motivational feedback loops.

### Color Roles & Ratios
- **Primary Canvas & Structural Text (`#1E293B` Deep Indigo Slate):** Acts as the primary anchor for dominant headings, navigational bars, active tabs, and primary emphasis text.
- **Interactive Accent (`#2563EB` Vibrant Royal Blue):** Reserved for primary interactive elements, lesson triggers, active play states, progress fills, and focused field rings.
- **Achievement & Streak Accent (`#F97316` Persimmon Coral):** Dedicated to daily attendance streaks, flashcard review queues, critical highlights, and milestone badges.
- **Success & Fluency Marker (`#10B981` Mint Emerald):** Signals correct answers, mastered vocabulary items, verified submissions, and active teacher status.
- **Surface Architecture:**
  - Base canvas: `#F8FAFC` (Slate-tinted crisp neutral)
  - Elevated surfaces: `#FFFFFF` (Pure white)
  - Inactive containers / Dividers: `#E2E8F0` and `#CBD5E1`
  - Secondary text / Annotations: `#64748B`

## Typography

The typographic balance bridges bilingual English and Korean (Hangul) typesetting seamlessly.

### Pairing & Script Optimization
- **Structural Latin Headings & Metric Labels:** Set in **Plus Jakarta Sans** for crisp numerals, geometric legibility, and welcoming proportions.
- **Hangul & Educational Body:** Set in **Noto Sans** to ensure uniform stroke balance, distinct syllable block recognition, and high clarity across varying phone resolutions.
- **Vertical Metrics:** Korean characters occupy fuller vertical bounds than Latin scripts. Line heights for Hangul body text maintain a minimum of 1.55x to 1.6x to prevent crowded diacritics and complex jamo glyph collisions.

## Layout & Spacing

The layout is built for responsive mobile-first usage, prioritizing ergonomic thumb zones and uncluttered modular content cards.

### Layout Philosophy & Grid System
- **Grid Architecture:** A 4-column fluid mobile grid system governed by a base 8px harmonic spacing system.
- **Horizontal Bleed & Margins:**
  - Mobile screens (<600px): `16px` (`margin`) outer gutter margin to maximize horizontal screen real estate for syllabic cards and flashcard drills.
  - Tablet & Foldables (600px - 1024px): `24px` gutter and `32px` margin with a 2-column card split.
- **Ergonomic Safe Zones:** Bottom interactive navigation bars and persistent audio lesson controls retain an offset safe area of `20px` beyond native system gesture insets.

## Elevation & Depth

Visual hierarchy uses clean, low-opacity ambient shadows tinted with the primary slate palette to create smooth, natural layering over the `#F8FAFC` base surface.

### Surface Tiers
- **Tier 0 (Canvas):** `#F8FAFC`. Background canvas, providing contrast for elevated cards.
- **Tier 1 (Resting Cards & Interactive Modules):** `#FFFFFF` with a 1px solid border in `#E2E8F0` and an ambient shadow:
  `box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03);`
- **Tier 2 (Active Learning Sheets & Draggable Modals):** `#FFFFFF` with:
  `box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03);`
- **Tier 3 (Floating Audio Bar & Bottom Sheets):** `#FFFFFF` surface with elevated vertical displacement:
  `box-shadow: 0 -4px 20px 0 rgba(15, 23, 42, 0.06);`
- **Focus / Active Stroke:** Selected card states drop heavy drop-shadows in favor of a 2px inner border highlight using `#2563EB` with an ultra-light tint background (`#EFF6FF`).

## Shapes

The interface balances soft approachability with architectural precision through a refined Level 2 roundedness rule.

### Radius Application
- **Primary Content Cards & Class Containers:** Standardized at `16px` to `20px` (`rounded-xl`), creating friendly yet controlled modular tiles.
- **Inputs & Action Items:** Inputs, segment buttons, and quiz option blocks use `12px` to `14px` (`rounded-lg`).
- **Status Tags, Progress Pills, & Micro-Badges:** Full pill-radius (`9999px`) to emphasize fluidity and progress states.
- **Korean Syllable Blocks (Interactive Hanja/Hangul tiles):** `14px` radius to retain structural character boundaries during drag-and-drop exercises.

## Components

### Buttons & Interactive Controls
- **Primary Action (CTA):** Height `52px`, background `#2563EB`, text `#FFFFFF`, rounded `14px`, font weight 600. Active tap state triggers a subtle scale down (`0.98`).
- **Secondary Action:** Height `52px`, background `#F1F5F9`, text `#1E293B`, rounded `14px`, 1px border `#E2E8F0`.
- **Streak & Lesson Completion CTA:** Gradient fill from `#F97316` to `#FB923C` for streak actions and rewards.

### Korean Learning Cards & Flashcards
- **Structure:** `#FFFFFF` background, `18px` border-radius, `1px solid #E2E8F0`, padding `16px`.
- **Phonetic & Romanization Hierarchy:** Prominent Hangul typography (`22px` - `26px`), supported by muted secondary romanization underneath in `13px` `#64748B`.
- **Audio Micro-Button:** Integrated top-right circular button (`36px × 36px`) in `#EFF6FF` with `#2563EB` speaker glyph.

### Status Pills & Streak Micro-Badges
- **Streak Badge:** Orange pill (`#FFF7ED`), text `#EA580C`, icon flame indicator, `11px` bold uppercase font.
- **Level/Proficiency Tag:** Soft slate/navy container (`#F1F5F9`), text `#334155`, border `1px solid #E2E8F0`.
- **Accuracy Tag:** Soft emerald background (`#ECFDF5`), text `#059669`.

### Progress Bars & Quotas
- **Track:** Height `8px`, background `#E2E8F0`, radius `9999px`.
- **Indicator:** Continuous smooth fill in `#2563EB` (or `#10B981` upon lesson mastery), radius `9999px`.

### Input Fields & Syllable Input Blocks
- **Height:** `50px`, background `#FFFFFF`, border `1.5px solid #CBD5E1`, corner radius `12px`.
- **Focus State:** Border shifts to `#2563EB` with a `3px` focus ring in `rgba(37, 99, 235, 0.12)`.
- **Syllable Assembly Cells:** Fixed square grid boxes (`56px × 56px`), dashed border `#94A3B8` when unassigned, solid `#2563EB` upon character insertion.

### Selection Chips & Checkboxes
- **Quiz Option Chips:** Full-width card with minimum height `54px`, horizontal flex alignment, `14px` radius, background `#FFFFFF`, border `1.5px solid #E2E8F0`. Selection toggles card to `#EFF6FF` background with `#2563EB` border.
- **Checkboxes & Radios:** `20px × 20px`, rounded `6px` for checkboxes and `9999px` for radios, filled with `#2563EB` when active.
---
name: Academic Fintech Ecosystem
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#454652'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#785900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc003'
  on-secondary-container: '#6c5000'
  tertiary: '#000f5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#072189'
  on-tertiary-container: '#7e90f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#fabd00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#dee0ff'
  tertiary-fixed-dim: '#bac3ff'
  on-tertiary-fixed: '#00105c'
  on-tertiary-fixed-variant: '#293ca0'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for FEB-X balances the institutional prestige of a leading business school with the agile efficiency of a modern fintech platform. The brand personality is authoritative yet innovative, aiming to evoke a sense of "Empowered Intelligence" in its users.

The visual style is **Corporate / Modern** with a focus on data density and clarity. It utilizes high-quality typography, a structured grid, and purposeful use of whitespace to ensure that complex financial and academic data remains accessible. Subtle influences from **Minimalism** prevent cognitive overload, while a disciplined color application ensures the UI feels premium and trustworthy.

## Colors
The palette is anchored by **Deep Navy Blue**, representing the foundation of trust and institutional authority. **Vibrant Gold** is used sparingly as a high-contrast accent for excellence, primary actions, and critical highlights.

- **Primary (Deep Navy):** Used for navigation bars, headers, and primary branding elements.
- **Secondary (Vibrant Gold):** Reserved for "Golden Path" actions, status indicators of excellence, and active states that require user attention.
- **Surface & Backgrounds:** A range of light grays (`#F5F5F5` to `#FFFFFF`) creates a layered, clean environment for data visualization.
- **Semantic Colors:** Standardized success (green), warning (amber), and error (red) tones should be desaturated to maintain the professional aesthetic.

## Typography
The system uses **Inter** for all primary UI text to ensure maximum legibility across high-density data views. Its neutral character allows the content to lead. For technical data, code snippets, or small tabular labels, **JetBrains Mono** is introduced to provide a distinct, "data-driven" feel that differentiates raw values from narrative text.

Headlines use tighter letter spacing to maintain a strong visual "lockup," while body text maintains standard spacing for long-form reading in reports or platform documentation.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain structured, professional alignment, transitioning to a **Fluid Grid** for tablet and mobile devices.

- **Desktop (1280px+):** 12-column grid, 24px gutters, 40px side margins.
- **Tablet (768px - 1279px):** 8-column grid, 16px gutters, 24px side margins.
- **Mobile (<767px):** 4-column grid, 16px gutters, 16px side margins.

A strict 4px baseline grid ensures vertical rhythm. Components should utilize `stack` variables for consistent spacing between elements in a vertical flow.

## Elevation & Depth
This design system uses **Tonal Layers** supplemented by **Low-contrast outlines**. 

In an enterprise context, heavy shadows can create visual clutter. Instead, elevation is communicated by shifting background colors (e.g., a white card on a light gray background). When depth is necessary for modals or menus, use an **Ambient Shadow**: a very soft, highly diffused shadow (`blur: 16px`, `opacity: 4%`) with a slight navy tint to maintain color harmony.

- **Level 0 (Background):** `#F5F5F5`
- **Level 1 (Cards/Surface):** `#FFFFFF` with a 1px border of `#E0E0E0`
- **Level 2 (Popovers/Modals):** `#FFFFFF` with Ambient Shadow and a 1px border.

## Shapes
To maintain a professional and "institutional" aesthetic, the system uses a **Soft** roundedness. This prevents the UI from feeling too clinical (sharp) or too consumer-oriented (pill-shaped).

- **Standard Elements (Inputs, Buttons, Chips):** 0.25rem (4px)
- **Large Elements (Cards, Containers):** 0.5rem (8px)
- **Extra Large (Modals):** 0.75rem (12px)

## Components

### Buttons
- **Primary:** Deep Navy background, White text. High-contrast Gold focus ring.
- **Secondary:** Transparent background, Navy 1px border, Navy text.
- **Tertiary:** Ghost style, Navy text, turns Light Gray on hover.

### Data Tables
Tables are the heart of the ecosystem. Use a 48px row height for standard density and 40px for high-density monitoring. Headers should be `label-md` in Navy with a subtle bottom border. Use alternating row stripes (Zebra striping) using `#F9F9F9`.

### Cards
Cards for product displays should have a subtle 1px border (`#E0E0E0`) instead of a shadow. Title text should be `headline-md`. Any "Premium" or "Featured" cards may use a 2px top-border in Vibrant Gold.

### Input Fields
Inputs use a 1px `#BDBDBD` border that transitions to a 2px Navy border on focus. Labels are always visible above the field using `body-sm` (Medium weight).

### Dashboard Charts
Charts should utilize a custom color sequence starting with Navy, then Gold, then Tertiary Indigo. Grid lines must be light (`#EEEEEE`) and tooltips should follow the "Level 2" elevation rule.
---
name: Digital Scrapbook
colors:
  surface: '#fff8f4'
  surface-dim: '#e8d7c9'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e7'
  surface-container: '#fdebdc'
  surface-container-high: '#f7e5d7'
  surface-container-highest: '#f1dfd1'
  on-surface: '#231a11'
  on-surface-variant: '#574146'
  inverse-surface: '#392f25'
  inverse-on-surface: '#ffeee0'
  outline: '#8a7176'
  outline-variant: '#ddbfc5'
  surface-tint: '#ac2a5d'
  primary: '#ac2a5d'
  on-primary: '#ffffff'
  primary-container: '#ff6b9d'
  on-primary-container: '#6e0035'
  inverse-primary: '#ffb1c5'
  secondary: '#845400'
  on-secondary: '#ffffff'
  secondary-container: '#feb246'
  on-secondary-container: '#6f4600'
  tertiary: '#665f34'
  on-tertiary: '#ffffff'
  tertiary-container: '#a89f6e'
  on-tertiary-container: '#3c360f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c5'
  on-primary-fixed: '#3f001b'
  on-primary-fixed-variant: '#8c0a46'
  secondary-fixed: '#ffddb6'
  secondary-fixed-dim: '#ffb95a'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#643f00'
  tertiary-fixed: '#eee3ad'
  tertiary-fixed-dim: '#d1c794'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#4e471f'
  background: '#fff8f4'
  on-background: '#231a11'
  surface-variant: '#f1dfd1'
typography:
  headline-lg:
    fontFamily: Gaegu
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Gaegu
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-accent:
    fontFamily: Nanum Pen Script
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.0'
  headline-lg-mobile:
    fontFamily: Gaegu
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-page: 24px
  gutter: 16px
  sticker-overlap: -12px
---

## Brand & Style

The design system is centered on the **Gen Z 'Kitsch' Scrapbook** aesthetic—a maximalist, tactile, and highly personalized visual language. It mimics the raw, expressive quality of a physical diary or a curated Instagram Story. The brand personality is optimistic, nostalgic, and intentionally "unpolished" to evoke authenticity and warmth.

The style combines **Tactile Scrapbooking** with **Playful Kitsch**. Key characteristics include:
- **Imperfection as Intent:** Surfaces use paper textures, and elements are intentionally rotated or slightly misaligned to feel hand-placed.
- **Doodle Narrative:** Communication is supported by hand-drawn squiggles, stars, and hearts that act as UI signifiers.
- **Analogue Metaphors:** Masking tape textures replace traditional dividers, and drop shadows create a sense of paper thickness rather than digital elevation.

## Colors

This design system utilizes a warm, food-inspired palette grounded by the Atelier Epicure aesthetic, energized with high-saturation "sticker" accents.

- **Primary (Pink):** Used for key interactions, hearts, and celebratory accents.
- **Secondary (Orange):** Used for energy, highlights, and star icons.
- **Tertiary (Butter Yellow):** The primary color for "post-it" style notes and highlighting text.
- **Neutral (Warm Brown):** Replaces black for all typography and hand-drawn doodles to maintain a soft, organic feel.
- **Background:** A creamy, textured paper off-white serves as the canvas.

Color application should feel like physical media—layering colors often results in slight "over-bleeds" or transparency, mimicking felt-tip markers or ink.

## Typography

The typography strategy relies on a "Dual-Layer" approach:
1.  **The Narrative Layer (Handwritten):** Uses **Gaegu** for headlines and **Nanum Pen Script** for marginalia, notes, and callouts. This layer represents the "user's voice" and should be applied liberally to make the interface feel personal.
2.  **The Functional Layer (Sans-Serif):** Uses **Plus Jakarta Sans** for body copy, form inputs, and technical data. This ensures the app remains usable and accessible despite the kitsch aesthetic.

**Styling Note:** Text in the Narrative Layer can be placed at 2-3 degree rotations and often features a "highlight" background using the Butter Yellow or Pink accents.

## Layout & Spacing

The layout philosophy is **Dynamic Collage**. While a 12-column grid is used for underlying structure, elements are encouraged to break the grid to create a "pasted-in" look.

- **Stacking & Overlap:** Components should use negative spacing (`sticker-overlap`) to layer over one another, mimicking how photos are placed in a physical scrapbook.
- **Responsive Reflow:** On mobile, the multi-column collage collapses into a single vertical stream, but keeps the varied rotations and "sticker" offsets.
- **Safe Margins:** Keep a generous 24px margin around the page edges to simulate the border of a paper page.

## Elevation & Depth

In this design system, depth is physical rather than digital. 

- **The Shadow:** Use a sharp, slightly offset shadow (Blur: 2px-4px, Opacity: 15%, Color: Neutral Brown) to make elements look like they are pieces of paper or stickers hovering just above the background.
- **Layering:** Hierarchy is established by stacking order. Items "pinned" with masking tape (represented by low-opacity rectangular overlays with jagged edges) appear at the highest level.
- **Backdrop:** The background should always have a subtle noise or paper grain texture to ground the floating elements.

## Shapes

The shape language is organic and "cut-out."
- **Sticker Cards:** Use `rounded-lg` (16px) or `rounded-xl` (24px) to simulate die-cut stickers.
- **Rotations:** Every major card or image container should have a random rotation between `-3deg` and `+3deg`.
- **Masking Tape:** Dividers and "pinned" states are represented by long, thin rectangles with uneven, "torn" ends.
- **Squiggles:** Replaces straight lines for horizontal rules and selection indicators. Use a SVG hand-drawn path for all borders that aren't masking tape.

## Components

### Stickers (Cards)
The core container. Stickers are white or tinted surfaces with a "paper" shadow and a subtle rotation. They often feature a "pin" icon or a piece of masking tape at the top.

### Buttons
Buttons should look like high-gloss stickers. Use the Primary Pink or Secondary Orange with a bold, 2px Neutral Brown border. On hover, the button should "jiggle" (a slight scale and rotation change).

### Chips & Tags
These look like small labels from a labeling machine or hand-torn paper scraps. They use the **Nanum Pen Script** font.

### Inputs
Input fields are styled as underlined areas, using a "scribbled" squiggly line instead of a clean straight line. Focus states are highlighted with a Butter Yellow background wash.

### Interaction Icons
Standard UI icons (Close, Add, Favorite) are replaced with:
- **Favorite:** A hand-drawn heart.
- **Add/Save:** A five-point star doodle.
- **Delete/Close:** A thick, "X" scribble.

### Masking Tape Dividers
Used to separate sections. These are semi-transparent (60% opacity) rectangular strips with a slight "washi tape" pattern (dots or stripes).
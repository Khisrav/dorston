# Design Language Guide

This document describes the visual design system extracted from Figma for the door configurator project. Use it as a reference when building or modifying UI components. The project uses **PrimeVue** and **Tailwind CSS**.

---

## Color Palette

All colors are derived from the Figma source. Tailwind equivalents are given for every token.

### Brand / Primary

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary | `#105072` | `sky-900` / custom | Buttons, borders, icons, labels, accents |
| Primary 25% | `#10507240` | `sky-900/25` | Card borders, input borders, subtle dividers |
| Primary 10% | `#1050721a` | `sky-900/10` | Badge borders |

> `sky-900` in Tailwind is `#0c4a6e` — very close but not exact. For pixel-perfect results, define a custom color: `primary: '#105072'` in `tailwind.config.js`.

### Text

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Text Primary | `#151616` | `zinc-950` | Headings, card titles, labels, body copy |
| Text Secondary | `#474a50` | `slate-600` | Subtitles, descriptions, helper text |
| Text on Primary | `#ffffff` | `white` | Text/icons on filled primary buttons |

### Backgrounds

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Page background | `#ffffff` | `white` | Page canvas, card fills |
| Surface subtle | `#f9fafb` | `gray-50` | Secondary button backgrounds, badge fills |

### Semantic (Badges & Notices)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Neutral badge bg | `#f9fafb` | `gray-50` | Default/neutral badge fill |
| Neutral badge text | `#4b5565` | `slate-500` | Default badge text |
| Indigo badge bg | `#eef2ff` | `indigo-50` | Info / "new" badge fill |
| Indigo badge text | `#432dd7` | `indigo-700` | Info badge text |
| Red badge bg | `#fef2f2` | `red-50` | Warning / unavailable badge fill |
| Red badge text | `#cc0000` | `red-700` | Warning badge text, disclaimer copy |

---

## Typography

No specific font family is declared in the export, but size and weight hierarchy is clear.

### Scale

| Role | Size (approx) | Tailwind | Example content |
|------|---------------|----------|-----------------|
| Page title | 48px / `text-5xl` | `text-5xl font-semibold` | "Конфигуратор дверей" |
| Page subtitle | 28px / `text-[28px]` | `text-2xl` | Description under the heading |
| Card / Section title | 32px / `text-3xl` | `text-3xl font-semibold` | "Для квартиры", "Итого: 120 000₽" |
| Body label | 24px / `text-2xl` | `text-xl font-medium` | "Конструктивы:" |
| Input label | 20px / `text-xl` | `text-base` | Field labels above inputs |
| Button text | 20px | `text-sm` | Button labels |
| Badge text | 16px | `text-xs` | Badge content |
| Fine print / notice | ~16px | `text-xs` | Disclaimer below price |

### Colors

- **Headings**: `text-zinc-950` (`#151616`)
- **Body / descriptions**: `text-slate-600` (`#474a50`)
- **Input labels**: `text-sky-900` (primary color)
- **Disclaimer / warning text**: `text-red-700`
- **Button text (primary)**: `text-white`
- **Button text (secondary)**: `text-sky-900`

---

## Spacing & Layout

### Page Grid

- **Canvas width**: 1440px
- **Content column**: 996px (centered, `max-w-[996px] mx-auto`)
- **Outer margin**: ~222px each side at full width
- **Section vertical gap**: `gap-9` (36px) between major layout blocks

### Card Layout (Index / Selection page)

- Two-column grid: `grid grid-cols-2 gap-6`
- Each card: 486px wide at full width, flexible otherwise

### Internal Spacing

| Context | Value | Tailwind |
|---------|-------|----------|
| Card internal padding | 36px | `p-9` |
| Content section top offset | 201px from card top (icon takes ~200px visual space) | handled by card layout |
| Vertical gap inside content block | 16px | `gap-4` |
| Button row gap | 16px | `gap-4` |
| Badge row gap | 8–10px | `gap-2` |
| Form field label → input gap | 8px | `gap-2` |

---

## Components

### Card

The primary container for configurator step options ("Для квартиры", "Для дома").

```
bg-white rounded-3xl border border-sky-900/25 overflow-hidden
```

**Structure:**
- Large icon fills roughly the right half of the card (absolute-positioned or split layout)
- Content (title + badges + button) sits on the left, at the bottom ~40% of the card
- Card height is tall (~379px), aspect is portrait-wide

**Tailwind example:**
```html
<div class="relative bg-white rounded-3xl border border-sky-900/25 overflow-hidden h-[379px]">
  <!-- Icon area (right half) -->
  <div class="absolute right-0 inset-y-0 w-1/2 flex items-center justify-center">
    <!-- Icon: ~300x300, stroke color sky-900 -->
  </div>

  <!-- Content (bottom-left) -->
  <div class="absolute bottom-0 left-0 p-9 flex flex-col gap-4">
    <div>
      <h2 class="text-3xl font-semibold text-zinc-950">...</h2>
      <span class="text-xl font-medium text-zinc-950 mt-2 block">Конструктивы:</span>
      <div class="flex gap-2 mt-1">
        <!-- Badges -->
      </div>
    </div>
    <!-- Primary Button -->
  </div>
</div>
```

---

### Summary Card ("Final")

Used for the price summary at the end of the configurator.

```
bg-white rounded-3xl border border-sky-900/25 p-6
```

- **Border-bottom divider** on the header row: `border-b border-sky-900/25`
- Price heading: `text-3xl font-semibold text-zinc-950`
- Collapse icon next to price: `text-slate-500`, size ~28px
- Button row gap: `gap-4`
- Disclaimer text below buttons: `text-xs text-red-700`

---

### Button — Primary (Solid)

The main CTA button.

```
bg-[#105072] text-white rounded-md h-9 px-3 flex items-center gap-1.5
```

- Height: 36px (`h-9`)
- Border radius: `rounded-md` (6px)
- Background: `bg-[#105072]` or PrimeVue `severity="contrast"` styled
- Text color: `text-white`
- No border, no shadow
- Icons: 16×16, white fill, placed left of text and optionally right (trailing arrow)
- Icon gap: 6px (`gap-1.5`)

**Tailwind example:**
```html
<button class="inline-flex items-center gap-1.5 h-9 px-3 bg-[#105072] text-white text-sm rounded-md">
  <SomeIcon class="w-4 h-4" />
  Настроить
  <ArrowUpRightIcon class="w-4 h-4" />
</button>
```

---

### Button — Secondary (Outline / Ghost)

Used for secondary actions like "Назад", "Скачать PDF".

```
bg-gray-50 text-[#105072] border border-sky-900/25 rounded-md h-9 px-3 shadow-sm
```

Variant with stronger border (for discrete actions):
```
bg-gray-50 text-[#105072] border border-gray-300 rounded-md h-9 px-3 shadow-sm
```

- Height: 36px (`h-9`)
- Border radius: `rounded-md` (6px)
- Background: `bg-gray-50` (`#f9fafb`)
- Text: `text-[#105072]`
- Border: `border border-sky-900/25` (subtle) or `border border-gray-300` (visible)
- Shadow: `shadow-sm` (`box-shadow: 0 1px 2px rgba(0,0,0,.05)`)
- Icons: 16×16, same `text-zinc-950` or `text-[#105072]` fill

---

### Badge

Compact label chips, used to show door type categories or status.

```
inline-flex items-center h-5 px-1.5 rounded-md text-xs
```

**Neutral (default):**
```
bg-gray-50 border border-slate-500/10 text-slate-500
```

**Indigo (info / "новинка"):**
```
bg-indigo-50 border border-indigo-700/10 text-indigo-700
```

**Red (warning / "не в наличии"):**
```
bg-red-50 border border-red-700/10 text-red-700
```

All badges:
- Height: 20px (`h-5`)
- Padding: 6px horizontal (`px-1.5`)
- Border radius: 6px (`rounded-md`)
- Font size: 12px (`text-xs`)

---

### Number Stepper Input

A custom quantity input with decrement / increment buttons.

```
bg-white border border-sky-900/25 rounded-xl h-12 flex items-center gap-3 px-3
```

- Height: 48px (`h-12`)
- Border radius: `rounded-xl` (12px)
- Border: `border border-sky-900/25`

**Minus button** (left, inactive / subtle):
```
w-6 h-6 rounded bg-[#105072]/25 flex items-center justify-center
```
- Background: primary at 25% opacity
- Icon: white minus sign

**Plus button** (right, active):
```
w-6 h-6 rounded bg-[#105072] flex items-center justify-center
```
- Background: solid primary
- Icon: white plus sign

Both stepper buttons use `rounded` (4px radius).

**Value text**: centered, `text-zinc-950`, `text-sm`.

---

### Radio Button

Used in form fields to select alignment, hinge side, etc.

**Checked state:**
```
w-4 h-4 rounded-full bg-[#105072] flex items-center justify-center
<!-- inner dot -->
<span class="w-1.5 h-1.5 rounded-full bg-white" />
```

**Unchecked state:**
```
w-4 h-4 rounded-full bg-white border border-sky-900/25
```

**Label:**
```
text-zinc-950 text-sm
```

**Wrapper** (radio + label):
```
flex items-center gap-2
```

**Radio group row:**
```
flex items-center gap-6
```

---

### Form Field (Input with Label)

```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium text-[#105072]">Петли</label>
  <!-- Radio group or stepper -->
</div>
```

- Label color: `text-[#105072]` (primary brand)
- Gap between label and control: `gap-2` (8px)

---

### Icons

- **Button icons**: 16×16 (`w-4 h-4`)
- **Card/summary info icons**: 28×28 (`w-7 h-7`), stroke color `text-slate-500`
- **Card hero icons**: ~300×300 decorative, stroke color `text-[#105072]`, stroke weight heavy
- Icon library in use: **Hugeicons** and **Lucide** (seen in Figma layer names: `hugeicons:apartment`, `lucide:house`)

---

## Border & Shadow Conventions

| Element | Border | Radius | Shadow |
|---------|--------|--------|--------|
| Cards | `border border-sky-900/25` | `rounded-3xl` (24px) | none |
| Summary card | `border border-sky-900/25` | `rounded-3xl` (24px) | none |
| Primary button | none | `rounded-md` (6px) | none |
| Secondary button | `border border-sky-900/25` | `rounded-md` (6px) | `shadow-sm` |
| Number input | `border border-sky-900/25` | `rounded-xl` (12px) | none |
| Badges | `border border-[color]/10` | `rounded-md` (6px) | none |
| Stepper buttons | none | `rounded` (4px) | none |

---

## PrimeVue Integration Notes

This design system is **custom** — it doesn't rely on default PrimeVue themes. When using PrimeVue components, override their styles with Tailwind utility classes or configure the PrimeVue passthrough system.

- **Buttons**: Use `<Button>` with `unstyled` prop or apply custom classes via `pt` passthrough. Target the primary color `#105072`.
- **InputNumber / InputText**: Override border, radius, and padding to match the stepper/input specs above.
- **RadioButton**: Match the filled-circle style (checked = solid `#105072` fill, unchecked = white with faint border).
- Avoid PrimeVue's built-in color tokens — use the Tailwind/custom values documented here.

---

## Do & Don't

| Do | Don't |
|----|-------|
| Use `#105072` (sky-900 range) as the single accent color | Introduce secondary brand colors (green, orange, etc.) |
| Use `rounded-3xl` for all cards and panels | Use `rounded-2xl` or `rounded-xl` on cards |
| Use `rounded-md` (6px) for buttons and badges | Round buttons more than 6px |
| Keep button height at 36px (`h-9`) | Make buttons taller or shorter without reason |
| Use a single primary stroke/border (`sky-900/25`) consistently | Mix different border opacities across components |
| Use `shadow-sm` only on secondary buttons | Add strong shadows to cards or primary buttons |
| Use `text-red-700` for disclaimers and error states | Use red for any other decorative purpose |
| Show icon + label + trailing icon in primary CTAs | Use icon-only buttons without tooltips |

# SEO MACHINE | DESIGN SYSTEM
**Version 2.5** | Machined Obsidian Aesthetic

---

## 🎯 Design Philosophy

The SEO Machine design system embodies **precision engineering** meets **intelligence systems**. Every element is crafted with orthogonal precision, minimal visual noise, and maximum functional clarity. Think aerospace-grade machined metal surfaces, CNC precision, and advanced monitoring interfaces.

### Core Principles
1. **Orthogonal Precision** - Clean grids, exact spacing, technical accuracy
2. **Machined Materials** - Dark obsidian surfaces with milled metallic edges
3. **Functional Minimalism** - Every element serves a purpose
4. **Intelligent Feedback** - Subtle animations and hover states
5. **Monospaced Data** - Technical information in monospaced fonts

---

## 🎨 Color Palette

### Primary Colors
```css
--obsidian-deep: #050506;        /* Deepest background - void black */
--obsidian-surface: #0c0c0e;     /* Main surface color */
--obsidian-elevated: #141417;    /* Elevated/hover states */
```

### Accent Colors
```css
--accent-cyan: #00f2ff;          /* Primary accent - electric cyan */
--accent-dim: #004c52;           /* Dimmed cyan for shadows/glows */
```

### Edge & Border Colors
```css
--milled-edge: rgba(255, 255, 255, 0.08);       /* Subtle borders */
--milled-highlight: rgba(255, 255, 255, 0.15);  /* Highlight edges */
```

### Text Colors
```css
--text-primary: #e4e4e7;         /* Primary text - near white */
--text-secondary: #71717a;       /* Secondary/muted text */
```

### Usage Guidelines
- **Obsidian Deep**: Main body background, void areas
- **Obsidian Surface**: Card backgrounds, modules, panels
- **Obsidian Elevated**: Hover states, raised elements
- **Accent Cyan**: Interactive elements, indicators, links, active states
- **Milled Edge**: All borders, dividers, grid lines
- **Text Primary**: Headings, important content
- **Text Secondary**: Metadata, timestamps, descriptive text

---

## 📝 Typography

### Font Families
```css
--sans-font: 'Inter', sans-serif;           /* UI text, headings, body */
--mono-font: 'IBM Plex Mono', monospace;    /* Technical data, metadata */
```

### Font Import
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=IBM+Plex+Mono:wght@300;400;600&display=swap" rel="stylesheet">
```

### Typography Scale

#### Display / Hero
- **Size**: 42px
- **Weight**: 900
- **Line Height**: 0.9
- **Letter Spacing**: -0.04em
- **Transform**: uppercase
- **Usage**: Main headings, hero text

#### Heading Large
- **Size**: 28px
- **Weight**: 700
- **Usage**: Section headings, card titles

#### Body Text
- **Size**: 14px
- **Weight**: 400
- **Line Height**: 1.5
- **Usage**: Descriptions, paragraph text

#### Technical Labels
- **Size**: 11-12px
- **Weight**: 400
- **Font**: IBM Plex Mono
- **Transform**: uppercase
- **Letter Spacing**: 0.5em (for labels)
- **Usage**: Metadata, technical labels, status indicators

#### Small Technical
- **Size**: 10px
- **Font**: IBM Plex Mono
- **Usage**: Timestamps, system info, decorative text

---

## 📐 Spacing & Grid

### Base Unit
```css
--grid-unit: 1px;
```

### Grid System
- **Background Grid**: 40px × 40px
- **Module Gap**: 2px (precision gap for machined look)
- **Section Padding**: 20-40px
- **Component Padding**: 15-30px

### Spacing Scale
- **Micro**: 4px, 8px, 12px
- **Small**: 15px, 20px, 24px
- **Medium**: 30px, 40px
- **Large**: 60px, 80px

---

## 🧩 Component Patterns

### Module Base Class
All major components inherit from `.module`:

```css
.module {
    background: var(--obsidian-surface);
    border: 1px solid var(--milled-edge);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Machined highlight edge */
.module::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--milled-highlight), transparent);
}
```

### Action Cards
Interactive cards with hover states:

```css
.action-card {
    padding: 40px;
    background: var(--obsidian-surface);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-card:hover {
    background: var(--obsidian-elevated);
    box-shadow: inset 0 0 40px rgba(0, 242, 255, 0.05);
}
```

**Elements:**
- Meta label (cyan, monospaced)
- Heading (28px, bold)
- Description (14px, secondary color)
- CTA button (machined style)

### Machined Button
```css
.btn-machined {
    padding: 12px 24px;
    border: 1px solid var(--accent-cyan);
    font-family: var(--mono-font);
    font-size: 12px;
    text-transform: uppercase;
    background: transparent;
    color: var(--accent-cyan);
    transition: 0.3s;
}

.btn-machined:hover {
    background: var(--accent-cyan);
    color: var(--obsidian-deep);
    box-shadow: 0 0 20px var(--accent-dim);
}
```

### Data Rows (Lists)
```css
.data-row {
    padding: 15px 0;
    border-bottom: 1px solid var(--milled-edge);
    display: flex;
    flex-direction: column;
    gap: 4px;
}
```

**Structure:**
- Title: 13px, weight 600
- Date/Meta: 10px, monospaced, secondary color

### Checklist Items
```css
.check-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255,255,255,0.02);
    border-left: 2px solid var(--text-secondary);
}

.check-item.complete {
    border-left-color: var(--accent-cyan);
    background: rgba(0, 242, 255, 0.03);
}
```

### Status Indicators

#### Active Indicator (Pulse)
```css
.active-indicator {
    width: 6px;
    height: 6px;
    background: var(--accent-cyan);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--accent-cyan);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
}
```

#### Meta Badges
```css
.meta::before {
    content: "";
    width: 8px;
    height: 8px;
    background: var(--accent-cyan);
    margin-right: 12px;
    display: inline-block;
}
```

---

## 🎬 Animations & Transitions

### Standard Transition
```css
transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
```

### Quick Transition
```css
transition: 0.3s;
```

### Hover Effects
1. **Cards**: Background elevation + subtle cyan glow
2. **Buttons**: Fill with cyan, invert text, add glow
3. **Links**: Underline appearance

### Pulse Animation
Used for active/live indicators:
```css
animation: pulse 2s infinite;
```

---

## 🖼️ Layout Patterns

### Main Viewport Grid
```css
.viewport {
    display: grid;
    grid-template-columns: 320px 1fr 320px;
    grid-template-rows: auto 1fr;
    height: 100vh;
    padding: 20px;
    gap: 2px;
}
```

**Structure:**
- Left sidebar: 320px
- Center content: Flexible
- Right sidebar: 320px
- Header spans full width

### Background Layers

#### Grid Pattern
```css
background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
background-size: 40px 40px;
```

#### Vignette Overlay
```css
body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, transparent, var(--obsidian-deep));
    pointer-events: none;
    z-index: 10;
}
```

---

## 🎯 Interactive Patterns

### Cursor Style
```css
cursor: crosshair;  /* Technical/precision aesthetic */
```

### Mouse-Reactive Grid
Background grid intensity changes based on mouse position:
```javascript
document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.backgroundImage = `
        linear-gradient(rgba(255,255,255,${0.01 + (x * 0.02)}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${0.01 + (y * 0.02)}) 1px, transparent 1px)
    `;
});
```

---

## 📋 Component Library

### Header Block
- Full-width spanning
- Brand cluster (left): Logo, title, description
- Status bits (right): System status, time, latency
- Gradient background: elevated to surface

### Sidebar Section
- Width: 320px
- Padding: 30px
- Contains: Label header + data rows or checklists

### Action Grid (2×2)
- Center content area
- Grid gap: 2px
- Card padding: 40px
- Hover: Elevation + cyan glow

### Data Glitch (Decorative)
- Position: absolute, bottom-left
- Font: Monospaced, 10px
- Color: Milled highlight
- Pointer events: none
- Usage: System information, version numbers

---

## ✅ SEO Readiness Checklist

### Technical SEO
- [ ] Semantic HTML structure (header, main, aside, nav)
- [ ] Meta charset UTF-8
- [ ] Viewport meta tag
- [ ] Title tag with branding
- [ ] Preconnect to font sources
- [ ] Alt text for images (when applicable)
- [ ] Accessible color contrast ratios

### Performance
- [ ] Minimal CSS (embedded for critical path)
- [ ] Font display: swap
- [ ] Optimized animations (GPU-accelerated properties)
- [ ] Minimal JavaScript
- [ ] No layout shifts

### Accessibility
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Focus visible states
- [ ] Readable font sizes (minimum 10px for metadata)
- [ ] Sufficient color contrast

---

## 🚀 Implementation Guidelines

### Getting Started
1. Import fonts from Google Fonts
2. Set up CSS variables in `:root`
3. Apply base styles to `*` and `body`
4. Create background grid and vignette
5. Build viewport grid structure
6. Add modules with base `.module` class
7. Implement components

### Best Practices
1. **Always use CSS variables** for colors and fonts
2. **Maintain 2px gaps** between grid modules
3. **Use monospaced font** for all technical/meta information
4. **Add hover states** to all interactive elements
5. **Include subtle animations** for premium feel
6. **Test with crosshair cursor** for full aesthetic
7. **Keep borders at 1px** for precision

### Responsive Considerations
- Viewport grid collapses on mobile
- Sidebar width: 320px on desktop, full-width on mobile
- Maintain 20px outer padding minimum
- Stack action cards vertically on narrow screens

---

## 📦 Quick Reference

### Class Naming Convention
- `.module` - Base component wrapper
- `.action-card` - Interactive card component
- `.btn-machined` - CTA button style
- `.data-row` - List item in sidebars
- `.check-item` - Checklist item
- `.sidebar-label` - Section header in sidebar
- `.meta` - Technical label/badge
- `.active-indicator` - Pulsing status dot

### Color Quick Reference
| Use Case | Variable | Hex |
|----------|----------|-----|
| Background | `--obsidian-deep` | #050506 |
| Cards | `--obsidian-surface` | #0c0c0e |
| Hover | `--obsidian-elevated` | #141417 |
| Interactive | `--accent-cyan` | #00f2ff |
| Borders | `--milled-edge` | rgba(255,255,255,0.08) |
| Text | `--text-primary` | #e4e4e7 |

---

## 🔧 Maintenance & Updates

### Version History
- **v2.5** (Current) - Machined Obsidian system established
- Future updates should maintain core aesthetic

### Design Tokens
All design tokens are centralized as CSS variables. Update the `:root` section to theme the entire system.

---

**END OF DESIGN SYSTEM DOCUMENTATION**

*Engineered with precision for SEO Machine v2.5*

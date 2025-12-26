# BillEase Suite - Design System Documentation

## Overview

A professional, accessible design system built for financial and accounting applications. Includes comprehensive color tokens, typography scale, spacing system, and component library with built-in dark mode support.

---

## 🎨 Color System

### Color Palette

The design system uses a professional color palette optimized for financial applications:

#### Primary Brand - Professional Blue
- **Purpose**: Main actions, interactive elements, primary navigation
- **Usage**: Buttons, links, active states, highlights
- **Contrast**: WCAG AAA compliant for text

```
Primary 600: hsl(222.2, 47.6%, 11.2%)   [Main brand color]
Primary 50-500: Light variants for backgrounds, hovers
Primary 700-900: Dark variants for hover states
```

#### Success - Financial Green
- **Purpose**: Positive outcomes, approved items, income
- **Usage**: Success badges, profit indicators, approved transactions
- **Psychology**: Conveys safety and positive action

```
Success 600: hsl(120, 61%, 34%)         [Main success color]
Used for: ✓ Completed transactions, ✓ Approved invoices, ✓ Profit indicators
```

#### Warning - Attention Orange
- **Purpose**: Items needing review, caution indicators
- **Usage**: Pending approvals, low balance alerts, items requiring action
- **Psychology**: Draws attention without alarming

```
Warning 600: hsl(40, 96%, 32%)          [Main warning color]
Used for: ⚠ Pending reviews, ⚠ Low stock, ⚠ Review needed
```

#### Destructive - Error Red
- **Purpose**: Critical actions, errors, deletions
- **Usage**: Failed transactions, delete confirmations, critical errors
- **Psychology**: Signals caution and importance

```
Destructive 600: hsl(0, 91%, 50%)       [Main destructive color]
Used for: ✗ Failed transactions, ✗ Errors, ✗ Critical alerts
```

#### Gray - Neutral Professional
- **Purpose**: Text, borders, disabled states, backgrounds
- **Usage**: Body text, secondary information, structural elements

```
50: Lightest (backgrounds)
500: Medium (secondary text)
900: Darkest (primary text in dark mode)
```

### Dark Mode Support

All colors automatically adapt for dark mode:

```css
/* Light Mode (default) */
--primary: hsl(222.2, 47.6%, 11.2%);
--background: hsl(0, 0%, 100%);
--foreground: hsl(222.2, 84%, 4.9%);

/* Dark Mode */
.dark {
  --primary: hsl(210, 40%, 96%);
  --background: hsl(222.2, 84%, 4.9%);
  --foreground: hsl(210, 40%, 98%);
}
```

### Using Colors in Tailwind

```jsx
// Using color utilities
<div className="bg-primary text-primary-foreground">Primary Background</div>
<div className="bg-success-100 text-success-600">Success Message</div>
<div className="bg-warning-50 border-l-4 border-warning">Warning Box</div>
<div className="text-destructive">Error Text</div>

// Using CSS Variables
<div style={{ color: 'hsl(var(--success))' }}>Success</div>

// Using color scale
<button className="bg-primary-600 hover:bg-primary-700">Button</button>
```

---

## 📝 Typography

### Font Families

- **Sans-serif** (default): `system-ui, sans-serif` - Clean, professional
- **Monospace**: For financial amounts, codes - ensures alignment

### Typography Scale

#### Headings
- **H1** (3rem, 700): Page titles
- **H2** (2.25rem, 700): Section headers
- **H3** (1.875rem, 600): Subsection headers
- **H4** (1.5rem, 600): Card titles
- **H5** (1.25rem, 600): Subsection labels
- **H6** (1.125rem, 600): Minor headings

#### Body Text
- **Body Large** (1.125rem): Highlighted content
- **Body Medium** (1rem): Default body text
- **Body Small** (0.875rem): Secondary information
- **Body XS** (0.75rem): Metadata, timestamps

#### Special Uses
- **Label** (0.8125rem, 500): Form labels, tags
- **Caption** (0.75rem): Helper text, dates, footnotes
- **Number** (2rem, 600, monospace): Financial amounts (for dashboard stats)
- **Number Large** (2.5rem, 700): Primary metrics
- **Number Small** (1.25rem, 600): Secondary amounts

### Typography Examples

```jsx
// Headings
<h1>Financial Dashboard</h1>
<h2>Monthly Summary</h2>
<h3>Revenue Overview</h3>

// Body Text
<p className="text-body-md">Main description text</p>
<p className="text-body-sm text-muted">Secondary information</p>

// Financial Amount
<div className="text-number">₹45,231.89</div>

// Labels & Captions
<label className="label">Amount</label>
<p className="caption">Last updated 2 hours ago</p>
```

---

## 📐 Spacing System

Uses an 8px base unit for consistent spacing:

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | 0.25rem (4px) | Minimal spacing |
| `sm` | 0.5rem (8px) | Component padding |
| `md` | 0.75rem (12px) | Inner spacing |
| `lg` | 1rem (16px) | Default padding |
| `xl` | 1.25rem (20px) | Section spacing |
| `2xl` | 1.5rem (24px) | Major spacing |
| `3xl` | 2rem (32px) | Section gaps |
| `4xl` | 2.5rem (40px) | Large gaps |
| `5xl` | 3rem (48px) | Page sections |
| `6xl` | 4rem (64px) | Major sections |

### Spacing Examples

```jsx
// Padding
<div className="p-4">Standard padding</div>
<div className="px-6 py-4">Horizontal + vertical</div>

// Margins
<div className="mb-8">Bottom margin</div>
<div className="gap-4">Gap between children</div>

// Common patterns
<div className="p-6">Card padding</div>
<div className="px-4 py-2">Button padding</div>
<div className="space-y-4">Vertical spacing between items</div>
```

---

## 🔲 Border Radius

Professional, subtle border radius values:

| Token | Value | Use Case |
|-------|-------|----------|
| `none` | 0 | No rounding |
| `xs` | 0.25rem | Minimal rounding |
| `sm` | 0.375rem | Subtle rounding |
| `base` | 0.5rem | Default (inputs, buttons) |
| `md` | 0.75rem | Card rounding |
| `lg` | 1rem | Modal rounding |
| `xl` | 1.25rem | Large containers |
| `2xl` | 1.5rem | Feature cards |
| `full` | 9999px | Fully rounded (badges, avatars) |

### Border Radius Examples

```jsx
<div className="rounded-button">Button</div>
<div className="rounded-card">Card Container</div>
<div className="rounded-input">Input Field</div>
<div className="rounded-full">Avatar</div>
<div className="rounded-lg">Modal Dialog</div>
```

---

## 🌑 Shadows

Subtle, professional shadows for financial apps:

| Level | Shadow | Use Case |
|-------|--------|----------|
| `xs` | Minimal | Microinteractions |
| `sm` | Very subtle | Background elements |
| `base` | Default | Standard cards |
| `md` | Moderate | Hovered cards |
| `lg` | Elevated | Dropdowns, tooltips |
| `xl` | Strong | Modals |
| `2xl` | Very strong | Top-layer overlays |
| `card` | Custom | Card default |
| `elevated` | Custom | Elevated cards |
| `hover` | Custom | Hover state |

### Shadow Examples

```jsx
<div className="shadow-card">Default card</div>
<div className="shadow-elevated hover:shadow-hover">Interactive card</div>
<div className="shadow-lg">Modal dialog</div>
<div className="shadow-inner">Inset element</div>
```

---

## 🧩 Component Library

### Card

Container for content with multiple style options.

```jsx
import { Card } from '@/components/design-system';

<Card>Content</Card>
<Card elevated>Elevated card</Card>
<Card bordered>Bordered card</Card>
<Card interactive>Clickable card</Card>
```

### Stat

Financial metric display component.

```jsx
import { Stat } from '@/components/design-system';

<Stat 
  label="Total Revenue"
  value="₹45,231.89"
  change={{ value: 12.5, isPositive: true }}
/>
```

### Badge

Status indicator or tag.

```jsx
import { Badge } from '@/components/design-system';

<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="muted">Inactive</Badge>
```

### Financial Table

Data table optimized for financial data.

```jsx
import { FinancialTable } from '@/components/design-system';

<FinancialTable
  headers={["Date", "Description", "Amount", "Status"]}
  rows={[
    ["2024-01-15", "Invoice #001", "₹5,000", <Badge>Paid</Badge>],
    ["2024-01-10", "Purchase", "₹2,500", <Badge variant="warning">Pending</Badge>],
  ]}
/>
```

### Alert

Contextual messages and warnings.

```jsx
import { Alert } from '@/components/design-system';

<Alert variant="success" title="Success">
  Transaction completed successfully
</Alert>

<Alert variant="warning" title="Pending Review">
  This invoice awaits approval
</Alert>

<Alert variant="destructive" title="Error">
  Failed to process payment
</Alert>
```

---

## 🎯 Component Classes

Predefined utility classes for common component patterns:

### Buttons

```jsx
// Size variants
<button className="btn-sm">Small</button>
<button className="btn-md">Medium</button>
<button className="btn-lg">Large</button>

// Color variants
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
<button className="btn-ghost">Ghost</button>
<button className="btn-success">Success</button>
<button className="btn-warning">Warning</button>
<button className="btn-destructive">Destructive</button>
```

### Inputs

```jsx
<input className="input-sm" placeholder="Small input" />
<input className="input-md" placeholder="Medium input" />
<input className="input-lg" placeholder="Large input" />
```

### Cards & Containers

```jsx
<div className="card">Default card</div>
<div className="card-elevated">Elevated card</div>
<div className="card-bordered">Bordered card</div>

<div className="stat">Stat display</div>

<div className="badge badge-primary">Tag</div>
<div className="badge badge-success">Success</div>
<div className="badge badge-warning">Warning</div>
<div className="badge badge-destructive">Error</div>
```

### Tables

```jsx
<table className="table-base">
  <thead className="table-header">
    <tr>
      <th className="table-header-cell">Column</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td className="table-cell">Cell</td>
    </tr>
  </tbody>
</table>
```

### Text Utilities

```jsx
<p className="text-muted">Secondary text</p>
<p className="text-success">Success message</p>
<p className="text-warning">Warning message</p>
<p className="text-destructive">Error message</p>
```

---

## 🌍 Accessibility

- **Contrast**: All color combinations meet WCAG AAA standards
- **Typography**: Proper line-height for readability
- **Focus States**: Visible focus indicators on all interactive elements
- **Semantic HTML**: Proper heading hierarchy, labels for inputs
- **Dark Mode**: Automatic theme detection and support

```jsx
// Focus state (automatic)
<button className="focus-visible:ring-2 focus-visible:ring-ring">
  Accessible Button
</button>

// High contrast text
<p className="text-foreground">High contrast text</p>

// Proper heading hierarchy
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

---

## 📱 Responsive Design

Use Tailwind's responsive prefixes:

```jsx
// Stack on mobile, row on tablet and up
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">Heading</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Container</div>
```

---

## 🎨 Customization

### Adding New Colors

Update `tailwind.config.ts`:

```ts
colors: {
  custom: {
    50: "hsl(var(--custom-50) / <alpha-value>)",
    600: "hsl(var(--custom-600) / <alpha-value>)",
  }
}
```

Update `globals.css`:

```css
:root {
  --custom-50: 0 100% 95%;
  --custom-600: 0 100% 50%;
}
```

### Adding New Components

Create in `components/design-system.tsx` and export from index file.

---

## 📚 Resources

- **Color Reference**: See `lib/design-tokens.ts`
- **Component Examples**: See `components/design-system.tsx`
- **CSS Variables**: See `app/globals.css`
- **Tailwind Config**: See `tailwind.config.ts`

---

## 💡 Best Practices

1. **Use semantic colors**: Choose colors based on meaning, not appearance
2. **Maintain hierarchy**: Use typography scale consistently
3. **Respect whitespace**: Use spacing scale for consistency
4. **Test dark mode**: Ensure readability in both modes
5. **Keep components reusable**: Build with props for flexibility
6. **Follow WCAG guidelines**: Ensure accessibility from the start
7. **Test with screen readers**: Ensure semantic HTML structure
8. **Use focus states**: Make interactive elements obvious

---

Built with ⚡ for professional financial applications

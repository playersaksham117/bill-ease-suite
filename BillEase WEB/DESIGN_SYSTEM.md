# BillEase Suite - Design System

## Overview

This document outlines the design system for BillEase Suite, including color schemes, typography, components, and UI patterns used across web, Flutter desktop, and Python desktop applications.

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` (rgb(37, 99, 235))
- **Primary Dark**: `#1e40af` (rgb(30, 64, 175))
- **Primary Light**: `#3b82f6` (rgb(59, 130, 246))

### Secondary Colors
- **Success Green**: `#10b981` (rgb(16, 185, 129))
- **Warning Orange**: `#f59e0b` (rgb(245, 158, 11))
- **Error Red**: `#ef4444` (rgb(239, 68, 68))
- **Info Purple**: `#8b5cf6` (rgb(139, 92, 246))

### Neutral Colors
- **Background**: `#f8fafc` (rgb(248, 250, 252))
- **Surface**: `#ffffff` (rgb(255, 255, 255))
- **Border**: `#e5e7eb` (rgb(229, 231, 235))
- **Text Primary**: `#1f2937` (rgb(31, 41, 55))
- **Text Secondary**: `#6b7280` (rgb(107, 114, 128))
- **Text Light**: `#9ca3af` (rgb(156, 163, 175))

## Typography

### Font Families
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'Courier New', monospace (for codes, numbers)

### Font Sizes
- **Heading 1**: 2rem (32px) - Bold
- **Heading 2**: 1.5rem (24px) - SemiBold
- **Heading 3**: 1.25rem (20px) - SemiBold
- **Body Large**: 1rem (16px) - Regular
- **Body**: 0.875rem (14px) - Regular
- **Body Small**: 0.75rem (12px) - Regular
- **Caption**: 0.625rem (10px) - Regular

## Component Library

### Buttons

#### Primary Button
```css
background: #2563eb
color: white
padding: 0.75rem 1.5rem
border-radius: 0.5rem
font-weight: 500
```

#### Secondary Button
```css
background: transparent
color: #2563eb
border: 1px solid #2563eb
padding: 0.75rem 1.5rem
border-radius: 0.5rem
```

#### Danger Button
```css
background: #ef4444
color: white
padding: 0.75rem 1.5rem
border-radius: 0.5rem
```

### Cards

```css
background: white
border: 1px solid #e5e7eb
border-radius: 0.75rem
padding: 1.5rem
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
```

### Input Fields

```css
border: 1px solid #e5e7eb
border-radius: 0.5rem
padding: 0.75rem
font-size: 0.875rem
```

### Tables

```css
width: 100%
border-collapse: collapse
th {
  background: #f9fafb
  padding: 0.75rem
  text-align: left
  font-weight: 600
  border-bottom: 2px solid #e5e7eb
}
td {
  padding: 0.75rem
  border-bottom: 1px solid #e5e7eb
}
```

## Layout Patterns

### Sidebar Navigation
- Width: 260px (desktop)
- Background: white
- Border-right: 1px solid #e5e7eb
- Sticky positioning

### Main Content Area
- Margin-left: 260px (when sidebar is visible)
- Max-width: 1400px
- Padding: 2rem
- Background: #f8fafc

### Dashboard Grid
- Grid layout: `repeat(auto-fill, minmax(300px, 1fr))`
- Gap: 1.5rem
- Responsive breakpoints

## Module-Specific Colors

### POS Module
- Primary: `#2563eb` (Blue)
- Gradient: `linear-gradient(135deg, #2563eb 0%, #1e40af 100%)`

### CRM Module
- Primary: `#10b981` (Green)
- Gradient: `linear-gradient(135deg, #10b981 0%, #059669 100%)`

### Income & Expense
- Primary: `#f59e0b` (Orange)
- Gradient: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`

### Invento Module
- Primary: `#8b5cf6` (Purple)
- Gradient: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`

### Accounts Plus
- Primary: `#ef4444` (Red)
- Gradient: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`

## Icons

Using Lucide React icons library:
- Consistent icon size: 20px (default), 24px (large)
- Icon colors match text colors
- Hover states: opacity 0.8

## Spacing System

Based on 4px grid:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Shadows

```css
/* Small shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

/* Medium shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

/* Large shadow */
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2)
```

## Animations

### Transitions
- **Default**: `transition: all 0.3s ease`
- **Fast**: `transition: all 0.2s ease`
- **Slow**: `transition: all 0.5s ease`

### Hover Effects
- **Card hover**: `transform: translateY(-2px)`
- **Button hover**: `opacity: 0.9`
- **Link hover**: `color: #2563eb`

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 2px solid #2563eb
- Keyboard navigation support
- ARIA labels for icons

## Figma Design Files

Design files are available in Figma with the following structure:
- **Master Components**: Reusable UI components
- **Pages**: Module-specific designs
- **Design Tokens**: Colors, typography, spacing
- **Prototypes**: Interactive flows

### Figma Links
- [Main Design System](https://figma.com/billease-suite-design-system)
- [Component Library](https://figma.com/billease-suite-components)
- [Module Designs](https://figma.com/billease-suite-modules)

## Implementation Notes

### Web (React)
- Uses CSS variables for theming
- Styled-components or CSS modules
- Responsive design with media queries

### Flutter Desktop
- Material Design 3 components
- Custom theme configuration
- Responsive layouts with LayoutBuilder

### Python Desktop (PyQt6)
- QSS (Qt Style Sheets) for styling
- Custom widget classes
- Consistent color palette

## Version History

- **v1.0.0**: Initial design system
- Colors, typography, and basic components defined
- Module-specific color schemes established


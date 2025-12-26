/**
 * BillEase Suite - Design System Tokens
 * 
 * A comprehensive design system for financial & accounting applications
 * with built-in dark mode support and professional aesthetics.
 */

/* ===== COLOR PALETTE ===== */

export const ColorTokens = {
  // PRIMARY BRAND - Professional Blue (Trust & Confidence)
  primary: {
    50: "hsl(222.2, 84%, 97.3%)",
    100: "hsl(222.2, 84%, 94.6%)",
    200: "hsl(222.2, 84%, 89.2%)",
    300: "hsl(222.2, 84%, 83.8%)",
    400: "hsl(222.2, 84%, 74.9%)",
    500: "hsl(222.2, 84%, 64%)",
    600: "hsl(222.2, 47.6%, 11.2%)",
    700: "hsl(221, 83%, 53%)",
    800: "hsl(216, 75%, 42%)",
    900: "hsl(210, 60%, 32%)",
  },

  // SUCCESS - Financial Green (Positive Results)
  success: {
    50: "hsl(120, 73%, 97%)",
    100: "hsl(120, 61%, 93%)",
    200: "hsl(120, 60%, 84%)",
    300: "hsl(120, 55%, 72%)",
    400: "hsl(120, 50%, 59%)",
    500: "hsl(120, 49%, 46%)",
    600: "hsl(120, 61%, 34%)",
    700: "hsl(120, 65%, 25%)",
    800: "hsl(120, 63%, 20%)",
    900: "hsl(120, 60%, 15%)",
  },

  // WARNING - Attention Orange (Caution & Review Needed)
  warning: {
    50: "hsl(40, 100%, 96%)",
    100: "hsl(40, 100%, 91%)",
    200: "hsl(40, 95%, 82%)",
    300: "hsl(40, 93%, 69%)",
    400: "hsl(40, 91%, 52%)",
    500: "hsl(40, 90%, 40%)",
    600: "hsl(40, 96%, 32%)",
    700: "hsl(40, 95%, 26%)",
    800: "hsl(40, 93%, 21%)",
    900: "hsl(40, 91%, 17%)",
  },

  // DESTRUCTIVE - Error Red (Critical Actions)
  destructive: {
    50: "hsl(0, 100%, 97%)",
    100: "hsl(0, 100%, 94%)",
    200: "hsl(0, 100%, 88%)",
    300: "hsl(0, 100%, 79%)",
    400: "hsl(0, 100%, 69%)",
    500: "hsl(0, 84%, 60%)",
    600: "hsl(0, 91%, 50%)",
    700: "hsl(0, 84%, 47%)",
    800: "hsl(0, 76%, 40%)",
    900: "hsl(0, 71%, 35%)",
  },

  // NEUTRAL GRAY - Professional & Accessible
  gray: {
    50: "hsl(0, 0%, 98%)",
    100: "hsl(0, 0%, 96%)",
    200: "hsl(0, 0%, 93%)",
    300: "hsl(0, 0%, 89%)",
    400: "hsl(0, 0%, 80%)",
    500: "hsl(0, 0%, 63%)",
    600: "hsl(0, 0%, 45%)",
    700: "hsl(0, 0%, 32%)",
    800: "hsl(0, 0%, 20%)",
    900: "hsl(0, 0%, 9%)",
  },
};

/* ===== TYPOGRAPHY ===== */

export const TypographyScale = {
  // Headings
  h1: { fontSize: "3rem", lineHeight: "3.5rem", fontWeight: 700, tracking: "tight" },
  h2: { fontSize: "2.25rem", lineHeight: "2.5rem", fontWeight: 700, tracking: "tight" },
  h3: { fontSize: "1.875rem", lineHeight: "2.25rem", fontWeight: 600, tracking: "tight" },
  h4: { fontSize: "1.5rem", lineHeight: "2rem", fontWeight: 600, tracking: "tight" },
  h5: { fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600 },
  h6: { fontSize: "1.125rem", lineHeight: "1.75rem", fontWeight: 600 },

  // Body Text
  bodyLg: { fontSize: "1.125rem", lineHeight: "1.75rem", fontWeight: 400 },
  bodyMd: { fontSize: "1rem", lineHeight: "1.5rem", fontWeight: 400 },
  bodySm: { fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: 400 },
  bodyXs: { fontSize: "0.75rem", lineHeight: "1rem", fontWeight: 400 },

  // Labels (for form inputs, tags)
  label: { fontSize: "0.8125rem", lineHeight: "1.125rem", fontWeight: 500 },

  // Caption (helper text, metadata)
  caption: { fontSize: "0.75rem", lineHeight: "1rem", fontWeight: 400 },

  // Financial Numbers
  number: { fontSize: "2rem", lineHeight: "2.5rem", fontWeight: 600, fontFamily: "monospace" },
  numberLg: { fontSize: "2.5rem", lineHeight: "3rem", fontWeight: 700, fontFamily: "monospace" },
  numberSm: { fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600, fontFamily: "monospace" },
};

/* ===== SPACING SCALE (8px system) ===== */

export const SpacingScale = {
  // 4px increments
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "0.75rem",   // 12px
  lg: "1rem",      // 16px
  xl: "1.25rem",   // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem",   // 32px
  "4xl": "2.5rem", // 40px
  "5xl": "3rem",   // 48px
  "6xl": "4rem",   // 64px

  // Common use cases
  gutter: "1.5rem",
  section: "2rem",
  page: "3rem",
};

/* ===== BORDER RADIUS ===== */

export const BorderRadius = {
  none: "0",
  xs: "0.25rem",     // 2px - Minimal curve
  sm: "0.375rem",    // 3px - Subtle
  base: "0.5rem",    // 4px - Default for inputs
  md: "0.75rem",     // 6px - Cards
  lg: "1rem",        // 8px - Larger containers
  xl: "1.25rem",     // 10px - Feature cards
  "2xl": "1.5rem",   // 12px - Large modals
  full: "9999px",    // Fully rounded

  // Purpose-based
  card: "0.75rem",
  button: "0.5rem",
  input: "0.5rem",
  modal: "1rem",
  avatar: "9999px",
};

/* ===== SHADOWS (Financial Design - Subtle & Professional) ===== */

export const Shadows = {
  // Elevation system
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",

  // Purpose-based
  card: "0 1px 3px rgba(0, 0, 0, 0.08)",
  elevated: "0 4px 12px rgba(0, 0, 0, 0.1)",
  hover: "0 10px 20px rgba(0, 0, 0, 0.12)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};

/* ===== TRANSITIONS & ANIMATIONS ===== */

export const Transitions = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",

  easing: {
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    ease: "ease",
  },
};

/* ===== COMPONENT SIZES ===== */

export const ComponentSizes = {
  // Button sizes
  button: {
    sm: { height: "2rem", padding: "0 0.75rem", fontSize: "0.875rem" },
    md: { height: "2.5rem", padding: "0 1rem", fontSize: "1rem" },
    lg: { height: "3rem", padding: "0 1.5rem", fontSize: "1rem" },
    icon: { height: "2.5rem", width: "2.5rem" },
  },

  // Input sizes
  input: {
    sm: { height: "2rem", padding: "0 0.75rem", fontSize: "0.875rem" },
    md: { height: "2.5rem", padding: "0 1rem", fontSize: "1rem" },
    lg: { height: "3rem", padding: "0 1rem", fontSize: "1rem" },
  },

  // Icon sizes
  icon: {
    xs: "1rem",
    sm: "1.25rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
    "2xl": "3rem",
  },

  // Layout
  sidebar: "260px",
  maxWidth: "1920px",
};

/* ===== BREAKPOINTS ===== */

export const Breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/* ===== COLOR SEMANTICS FOR FINANCE APPS ===== */

export const SemanticColors = {
  // Status indicators
  success: ColorTokens.success[600],     // Green - Positive, approved, active
  warning: ColorTokens.warning[600],     // Orange - Attention needed, review
  error: ColorTokens.destructive[600],   // Red - Critical, must fix
  info: ColorTokens.primary[600],        // Blue - Informational

  // Financial amounts
  positive: ColorTokens.success[600],    // Income, profit, credits
  negative: ColorTokens.destructive[600], // Expenses, loss, debits
  neutral: ColorTokens.gray[600],        // Transactions, transfers

  // Table/List states
  active: ColorTokens.primary[600],
  inactive: ColorTokens.gray[400],
  disabled: ColorTokens.gray[300],
};

/* ===== USAGE EXAMPLES ===== */

/*
 * COLOR USAGE:
 * - Primary: Main buttons, links, active states
 * - Success: Profit, approved transactions, positive indicators
 * - Warning: Pending items, low balance, needs attention
 * - Destructive: Delete actions, critical errors, failed transactions
 * 
 * TYPOGRAPHY:
 * - H1-H3: Page titles
 * - H4-H6: Section headers
 * - Body: Main content
 * - Label: Form labels
 * - Caption: Help text, dates, metadata
 * - Number: Financial amounts (use monospace for alignment)
 *
 * SPACING:
 * - xs/sm: Inner component spacing
 * - md/lg: Component to component spacing
 * - xl/2xl: Section spacing
 * - 3xl+: Page-level spacing
 *
 * SHADOWS:
 * - xs/sm: Subtle elevation (default cards)
 * - md: Medium elevation (hoverable elements)
 * - lg+: Modals, dropdowns, overlays
 *
 * EXAMPLE COMPONENT CLASSES (in globals.css):
 * - .card: Rounded card with shadow
 * - .stat: Financial metric display
 * - .badge: Status indicator
 * - .btn-primary: Primary action button
 */

const designTokens = {
  ColorTokens,
  TypographyScale,
  SpacingScale,
  BorderRadius,
  Shadows,
  Transitions,
  ComponentSizes,
  Breakpoints,
  SemanticColors,
};

export default designTokens;

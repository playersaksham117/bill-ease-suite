import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Color Palette - Finance Focused
      colors: {
        // Brand Colors
        primary: {
          50: "hsl(var(--primary-50) / <alpha-value>)",
          100: "hsl(var(--primary-100) / <alpha-value>)",
          200: "hsl(var(--primary-200) / <alpha-value>)",
          300: "hsl(var(--primary-300) / <alpha-value>)",
          400: "hsl(var(--primary-400) / <alpha-value>)",
          500: "hsl(var(--primary-500) / <alpha-value>)",
          600: "hsl(var(--primary-600) / <alpha-value>)",
          700: "hsl(var(--primary-700) / <alpha-value>)",
          800: "hsl(var(--primary-800) / <alpha-value>)",
          900: "hsl(var(--primary-900) / <alpha-value>)",
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        // Semantic Colors
        success: {
          50: "hsl(var(--success-50) / <alpha-value>)",
          100: "hsl(var(--success-100) / <alpha-value>)",
          200: "hsl(var(--success-200) / <alpha-value>)",
          300: "hsl(var(--success-300) / <alpha-value>)",
          400: "hsl(var(--success-400) / <alpha-value>)",
          500: "hsl(var(--success-500) / <alpha-value>)",
          600: "hsl(var(--success-600) / <alpha-value>)",
          700: "hsl(var(--success-700) / <alpha-value>)",
          800: "hsl(var(--success-800) / <alpha-value>)",
          900: "hsl(var(--success-900) / <alpha-value>)",
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          50: "hsl(var(--warning-50) / <alpha-value>)",
          100: "hsl(var(--warning-100) / <alpha-value>)",
          200: "hsl(var(--warning-200) / <alpha-value>)",
          300: "hsl(var(--warning-300) / <alpha-value>)",
          400: "hsl(var(--warning-400) / <alpha-value>)",
          500: "hsl(var(--warning-500) / <alpha-value>)",
          600: "hsl(var(--warning-600) / <alpha-value>)",
          700: "hsl(var(--warning-700) / <alpha-value>)",
          800: "hsl(var(--warning-800) / <alpha-value>)",
          900: "hsl(var(--warning-900) / <alpha-value>)",
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        destructive: {
          50: "hsl(var(--destructive-50) / <alpha-value>)",
          100: "hsl(var(--destructive-100) / <alpha-value>)",
          200: "hsl(var(--destructive-200) / <alpha-value>)",
          300: "hsl(var(--destructive-300) / <alpha-value>)",
          400: "hsl(var(--destructive-400) / <alpha-value>)",
          500: "hsl(var(--destructive-500) / <alpha-value>)",
          600: "hsl(var(--destructive-600) / <alpha-value>)",
          700: "hsl(var(--destructive-700) / <alpha-value>)",
          800: "hsl(var(--destructive-800) / <alpha-value>)",
          900: "hsl(var(--destructive-900) / <alpha-value>)",
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        // Neutral Colors
        gray: {
          50: "hsl(var(--gray-50) / <alpha-value>)",
          100: "hsl(var(--gray-100) / <alpha-value>)",
          200: "hsl(var(--gray-200) / <alpha-value>)",
          300: "hsl(var(--gray-300) / <alpha-value>)",
          400: "hsl(var(--gray-400) / <alpha-value>)",
          500: "hsl(var(--gray-500) / <alpha-value>)",
          600: "hsl(var(--gray-600) / <alpha-value>)",
          700: "hsl(var(--gray-700) / <alpha-value>)",
          800: "hsl(var(--gray-800) / <alpha-value>)",
          900: "hsl(var(--gray-900) / <alpha-value>)",
        },
        // Structural Colors
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
      },

      // Typography Scale
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        // Financial-specific sizes
        number: ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
        label: ["0.8125rem", { lineHeight: "1.125rem", fontWeight: "500" }],
        caption: ["0.75rem", { lineHeight: "1rem" }],
      },

      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["monospace"],
      },

      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },

      // Spacing Scale (8px system)
      spacing: {
        0: "0",
        0.5: "0.125rem",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
        40: "10rem",
        48: "12rem",
        56: "14rem",
        64: "16rem",
      },

      // Border Radius - Professional Standards
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        base: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
        // Finance-specific
        card: "0.75rem",
        button: "0.5rem",
        input: "0.5rem",
      },

      // Box Shadows - Financial Design
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
        // Finance-specific shadows
        card: "0 1px 3px rgba(0, 0, 0, 0.08)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.1)",
        hover: "0 10px 20px rgba(0, 0, 0, 0.12)",
      },

      // Animation
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      // Transition
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },

      transitionTiming: {
        "ease-smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // Width / Height
      width: {
        sidebar: "260px",
        full: "100%",
        screen: "100vw",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "admin-sidebar-background": "hsl(var(--admin-sidebar-background))",
        "admin-main-background": "hsl(var(--admin-main-background))",
        "admin-header-background": "hsl(var(--admin-header-background))",
        "admin-sidebar-active-background": "hsl(var(--admin-sidebar-active-background))",
        "admin-sidebar-active-foreground": "hsl(var(--admin-sidebar-active-foreground))",
        
        // 分析页面专用颜色
        "analysis-background": "hsl(var(--analysis-background))",
        "analysis-card": "hsl(var(--analysis-card))",
        "analysis-card-secondary": "hsl(var(--analysis-card-secondary))",
        "analysis-card-hover": "hsl(var(--analysis-card-hover))",
        "analysis-text": "hsl(var(--analysis-text))",
        "analysis-text-secondary": "hsl(var(--analysis-text-secondary))",
        "analysis-text-muted": "hsl(var(--analysis-text-muted))",
        "analysis-border": "hsl(var(--analysis-border))",
        "analysis-button-hover": "hsl(var(--analysis-button-hover))",
        "analysis-accent": "hsl(var(--analysis-accent))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

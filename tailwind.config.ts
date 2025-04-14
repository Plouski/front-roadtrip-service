import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        primary: {
          DEFAULT: "#E30613", // Rouge ROADTRIP!
          foreground: "#FFFFFF",
          50: "#fef2f2",
          100: "#fde3e3",
          200: "#fccccc",
          300: "#f8a5a5",
          400: "#f47070",
          500: "#ec4040",
          600: "#E30613", // Couleur principale de la marque
          700: "#be0511",
          800: "#a00714",
          900: "#860b16",
          950: "#4b0208",
        },
        secondary: {
          DEFAULT: "#1A1A1A", // Noir / gris foncé
          foreground: "#FFFFFF",
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#666666",
          600: "#4d4d4d",
          700: "#333333",
          800: "#1A1A1A",
          900: "#0D0D0D",
          950: "#000000",
        },
        accent: {
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
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
      boxShadow: {
        'roadtrip': '0 4px 14px 0 rgba(227, 6, 19, 0.15)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(45deg, #E30613)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
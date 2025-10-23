import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        // Paletas para el hero (cream / copper)
        cream: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f1ea',
          300: '#ede7dc',
          400: '#e4dac9',
          500: '#d9cab3',
          600: '#c9b599',
          700: '#b39c7d',
          800: '#8f7d63',
          900: '#6d5f4a',
        },
        copper: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f3ddc4',
          300: '#eac49d',
          400: '#dda26e',
          500: '#d4844e',
          600: '#c66d3f',
          700: '#a65836',
          800: '#854831',
          900: '#6d3d2b',
        },

        // Paleta de acentos: rosas, tierra, amarillos, verdes, azules y neutrales
        rose: {
          50: '#fff5f7',
          100: '#ffeef2',
          200: '#ffd6e6',
          300: '#ff9fcf',
          400: '#ff6fae',
          500: '#ff2d6f',
          600: '#e62460',
          700: '#a81a45',
          800: '#7a1130',
          900: '#4d0a21',
        },
        earth: {
          50: '#fff8f3',
          100: '#fff1e6',
          200: '#f7dcc4',
          300: '#e8b68d',
          400: '#d69a6b',
          500: '#b76b44',
          600: '#9a4f33',
          700: '#7a3d2a',
          800: '#5b2e22',
          900: '#3e2017',
        },
        amber: {
          50: '#fffaf0',
          100: '#fff4d9',
          200: '#ffe7a8',
          300: '#ffd166',
          400: '#ffb84a',
          500: '#ff9f1f',
          600: '#e08510',
          700: '#a8680d',
          800: '#7a4b0a',
          900: '#53330a',
        },
        green: {
          50: '#f6fff5',
          100: '#ecffea',
          200: '#d6ffd1',
          300: '#9fe79f',
          400: '#5fcf6a',
          500: '#2aab3a',
          600: '#238a31',
          700: '#196726',
          800: '#124c1c',
          900: '#0c3714',
        },
        sky: {
          50: '#f3fbff',
          100: '#e8f7ff',
          200: '#cfeefd',
          300: '#9fdff9',
          400: '#66c6f2',
          500: '#2ba7e6',
          600: '#238fcf',
          700: '#1a6aa0',
          800: '#124d78',
          900: '#0b334f',
        },
        neutral: {
          50: '#fdfdfc',
          100: '#fbfaf7',
          200: '#f4f2ee',
          300: '#e9e6df',
          400: '#dcd6cc',
          500: '#cfc6bb',
          600: '#b9ac9a',
          700: '#948773',
          800: '#6f6050',
          900: '#4a3f33',
        },

        // Semantic tokens mapped to the palette
        brand: {
          DEFAULT: '#d4844e', // copper-500
          foreground: '#ffffff',
        },
        'brand-dark': {
          DEFAULT: '#c66d3f', // copper-600
          foreground: '#ffffff',
        },
        site: {
          DEFAULT: '#faf8f5', // cream-100
        },
        surface: {
          DEFAULT: '#fff',
          muted: '#f5f1ea', // cream-200
        },

        // keep existing CSS-var based theme tokens (used elsewhere)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
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

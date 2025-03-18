import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "100": "#FEEAC0",
          "200": "#FED580",
          "300": "#FEC242",
          "500": "#BE8202",
          "600": "#7F5601",
          "700": "#3F2B01",
          default: "#FEAD03",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "100": "#C7E6EE",
          "200": "#8FCEDD",
          "300": "#59B6CD",
          "500": "#19768D",
          "600": "#104F5E",
          "700": "#08272F",
          default: "#219EBC",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          "100": "#FFDDC8",
          "200": "#FFBC91",
          "300": "#FF9B5C",
          "500": "#BF5B1C",
          "600": "#803D12",
          "700": "#401E09",
          default: "#FF7A25",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        error: "#FD3D39",
        success: "#53D86A",
        warning: "#FEC242",
        info: "#2196F3",
        background: "hsl(var(--background))",
        text: "#333",
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        rancho: ["Rancho", "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "primary-default": "0px 0px 10px rgba(254, 173, 3, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;

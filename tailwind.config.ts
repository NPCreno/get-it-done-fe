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
        },
        secondary: {
          "100": "#C7E6EE",
          "200": "#8FCEDD",
          "300": "#59B6CD",
          "500": "#19768D",
          "600": "#104F5E",
          "700": "#08272F",
          default: "#219EBC",
        },
        accent: {
          "100": "#FFDDC8",
          "200": "#FFBC91",
          "300": "#FF9B5C",
          "500": "#BF5B1C",
          "600": "#803D12",
          "700": "#401E09",
          default: "#FF7A25",
        },
        error: {
          "100": "#FECECD",
          "200": "#FD9D9B",
          "300": "#FE6E6B",
          "500": "#BE2E2B",
          "600": "#7E1E1C",
          "700": "#3F0F0E",
          default: "#FD3D39",
        },
        success: "#53D86A",
        warning: "#FEC242",
        info: "#2196F3",
        background: "#EEEEEE",
        text: "#333",
        border: "#E0E0E0",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        rancho: ["Rancho", "cursive"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        "primary-default": "0px 0px 10px rgba(254, 173, 3, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;

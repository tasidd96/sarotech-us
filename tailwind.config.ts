import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saro: {
          green: "#2D6A4F",
          "green-light": "#40916C",
          "green-dark": "#1B4332",
          dark: "#1A1A1A",
          "dark-alt": "#2C2C2C",
          light: "#F5F5F5",
          gray: "#6B7280",
        },
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};
export default config;

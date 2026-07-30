import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0c",
        bone: "#f5f2ec",
        clay: "#b08a63",
        moss: "#3f4a3c",
        rust: "#9a3f2e",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      perspective: {
        "1000": "1000px",
        "1500": "1500px",
      },
    },
  },
  plugins: [],
};
export default config;

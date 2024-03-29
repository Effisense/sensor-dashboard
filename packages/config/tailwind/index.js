/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./src/_app.tsx"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        sage: {
          1: "#fbfdfc",
          2: "#f8faf9",
          3: "#f1f4f3",
          4: "#ecefed",
          5: "#e6e9e8",
          6: "#dfe4e2",
          7: "#d7dcda",
          8: "#c2c9c6",
          9: "#8a918e",
          10: "#808784",
          11: "#6a716e",
          12: "#111c18",
        },
        green: {
          1: "#fbfefc",
          2: "#f2fcf5",
          3: "#e9f9ee",
          4: "#ddf3e4",
          5: "#ccebd7",
          6: "#b4dfc4",
          7: "#92ceac",
          8: "#5bb98c",
          9: "#30a46c",
          10: "#299764",
          11: "#18794e",
          12: "#153226",
        },
        mint: {
          1: "#f9fefd",
          2: "#effefa",
          3: "#e1fbf4",
          4: "#d2f7ed",
          5: "#c0efe3",
          6: "#a5e4d4",
          7: "#7dd4c0",
          8: "#40c4aa",
          9: "#70e1c8",
          10: "#69d9c1",
          11: "#147d6f",
          12: "#09342e",
        },
        teal: {
          1: "#fafefd",
          2: "#f1fcfa",
          3: "#e7f9f5",
          4: "#d9f3ee",
          5: "#c7ebe5",
          6: "#afdfd7",
          7: "#8dcec3",
          8: "#53b9ab",
          9: "#12a594",
          10: "#0e9888",
          11: "#067a6f",
          12: "#10302b",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      height: {
        main: "calc(100vh-5rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

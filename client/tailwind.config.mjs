/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f1f4f9", // Light background color
        primary: {
          50: "hsl(250, 100%, 97.6%)", // Very light violet
          100: "hsl(251, 91.3%, 95.5%)", 
          200: "hsl(250, 95.2%, 91.8%)", 
          300: "hsl(252, 94.7%, 85.1%)", 
          400: "hsl(255, 91.7%, 76.3%)", 
          500: "hsl(258, 89.5%, 66.3%)", // Primary violet
          600: "hsl(262, 83.3%, 57.8%)", 
          700: "hsl(263, 70%, 50.4%)", 
          800: "hsl(263, 69.3%, 42.2%)", 
          900: "hsl(263, 67.4%, 34.9%)", 
          950: "hsl(265, 61.5%, 21.4%)", // Deep violet
        },
        success: {
          50: "#e7fef3", // Light green
          100: "#c8f9e1",
          200: "#93f2c8",
          300: "#4fe3a4",
          400: "#22d57d",
          500: "#12b368", // Main success green
          600: "#0c8a50",
          700: "#08693e",
          800: "#054e2e",
          900: "#03371f",
        },
        danger: {
          50: "#ffe9e9", // Light red
          100: "#ffcece",
          200: "#ff9d9d",
          300: "#ff6b6b",
          400: "#fa4646",
          500: "#dc2626", // Main danger red
          600: "#b81d1d",
          700: "#911616",
          800: "#6c0f0f",
          900: "#500a0a",
        },
        warning: {
          50: "#fffbea", // Light yellow
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Main warning orange
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        neutral: {
          50: "#f9fafb", // Light neutral gray
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280", // Neutral gray
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};

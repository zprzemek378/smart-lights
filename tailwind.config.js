/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(224.3 76.3% 48%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 47.4% 11.2%)",

        primary: "hsl(222.2 47.4% 11.2%)",
        "primary-foreground": "hsl(210 40% 98%)",

        secondary: "hsl(210 40% 96.1%)",
        "secondary-foreground": "hsl(222.2 47.4% 11.2%)",

        muted: "hsl(210 40% 96.1%)",
        "muted-foreground": "hsl(215.4 16.3% 46.9%)",

        accent: "hsl(210 40% 96.1%)",
        "accent-foreground": "hsl(222.2 47.4% 11.2%)",

        destructive: "hsl(0 84.2% 60.2%)",
        "destructive-foreground": "hsl(210 40% 98%)",

        success: "hsl(142.1 76.2% 36.3%)",
        "success-foreground": "hsl(210 40% 98%)",

        warning: "hsl(40.0 100% 50%)",
        "warning-foreground": "hsl(210 40% 98%)",

        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(222.2 47.4% 11.2%)",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

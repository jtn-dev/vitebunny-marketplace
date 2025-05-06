/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'card-bg': 'var(--card-bg)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
};

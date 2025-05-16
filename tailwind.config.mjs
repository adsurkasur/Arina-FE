import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
      },
      colors: {
        foreground: { DEFAULT: 'hsl(var(--foreground))' },
        background: { DEFAULT: 'hsl(var(--background))' },
        muted: { DEFAULT: 'hsl(var(--muted))' },
        'muted-foreground': { DEFAULT: 'hsl(var(--muted-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))' },
        'popover-foreground': { DEFAULT: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))' },
        'card-foreground': { DEFAULT: 'hsl(var(--card-foreground))' },
        border: { DEFAULT: 'hsl(var(--border))' },
        input: { DEFAULT: 'hsl(var(--input))' },
        primary: { DEFAULT: 'hsl(var(--primary))' },
        'primary-foreground': { DEFAULT: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))' },
        'secondary-foreground': { DEFAULT: 'hsl(var(--secondary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))' },
        'accent-foreground': { DEFAULT: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))' },
        'destructive-foreground': { DEFAULT: 'hsl(var(--destructive-foreground))' },
        ring: { DEFAULT: 'hsl(var(--ring))' },
        // Add more as needed for your custom utilities
      },
      // Ensure borderRadius and other theme keys are extended if used in @apply
      borderRadius: {
        'lg': '0.5rem',
        'none': '0',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      },
      transitionProperty: {
        'all': 'all',
      },
      translate: {
        '-0.5': '-0.125rem',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

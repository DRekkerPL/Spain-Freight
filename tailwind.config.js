/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg:       '#0d0d0d',
        surface:  '#1a1a1a',
        surface2: '#222222',
        border:   '#2d2d2d',
        faint:    '#1e1e1e',
        accent:   '#2E60A8',
        accent2:  '#79A99A',
        danger:   '#ef4444',
        warn:     '#f59e0b',
        ok:       '#006B44',
        muted:    '#7a8a96',
        text:     '#e2e8f0',
        // named brand tokens
        'brand-blue':   '#2E60A8',
        'brand-green':  '#006B44',
        'brand-lblue':  '#B8CCE0',
        'brand-sage':   '#79A99A',
        'brand-sand':   '#B5AA9C',
      },
    },
  },
  plugins: [],
}

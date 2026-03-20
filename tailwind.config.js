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
        bg:       '#F5F4F2',
        surface:  '#FFFFFF',
        surface2: '#EEECe8',
        border:   '#E0DDD7',
        faint:    '#F0EEEA',
        accent:   '#2E60A8',
        accent2:  '#79A99A',
        danger:   '#ef4444',
        warn:     '#f59e0b',
        ok:       '#006B44',
        muted:    '#6B7A84',
        text:     '#1A1A1A',
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

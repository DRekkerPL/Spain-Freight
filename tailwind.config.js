module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        page:    '#F8FAFC',
        surface: '#FFFFFF',
        subtle:  '#F1F5F9',
        border:  '#E2E8F0',
        primary: '#2563EB',
        success: '#16A34A',
        danger:  '#DC2626',
        warning: '#D97706',
        ink:     '#0F172A',
        muted:   '#64748B',
        'brand-sand': '#B5AA9C',
      }
    }
  },
  plugins: []
}

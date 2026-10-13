/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Maktabi Brand Colors (library green)
        brand: {
          50: '#f0f7f2',
          100: '#dcefe2',
          200: '#b9dfc7',
          300: '#8cc7a3',
          400: '#57a97b',
          500: '#2f7d5b',
          600: '#256a4c',
          700: '#1d553d',
          800: '#173f2e',
          900: '#123024',
          950: '#0a1c15',
        },
        // Primary (library green) palette
        primary: {
          50: '#f0f7f2',
          100: '#dcefe2',
          200: '#b9dfc7',
          300: '#8cc7a3',
          400: '#57a97b',
          500: '#2f7d5b',
          600: '#256a4c',
          700: '#1d553d',
          800: '#173f2e',
          900: '#123024',
          950: '#0a1c15',
        },
        // Accent (antique gold) palette
        accent: {
          50: '#fdf9ec',
          100: '#faf0cf',
          200: '#f4df9d',
          300: '#eccb67',
          400: '#e3b93c',
          500: '#d4a02a',
          600: '#b98420',
          700: '#96651c',
          800: '#7a521d',
          900: '#68451c',
          950: '#3c260c',
        },
        // Semantic colors
        surface: {
          light: '#fffdf8',
          dark: '#221b12',
        },
        background: {
          light: '#f5efe3',
          dark: '#17120c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        serif: ['Lora', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(47, 125, 91, 0.3)',
        'glow-lg': '0 0 40px rgba(47, 125, 91, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(47, 125, 91, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
  safelist: [
    // Color opacity variants
    { pattern: /bg-(primary|emerald|amber|red|blue|purple|accent)-(50|100|200|300|400|500|600|700|800|900)\/(5|10|15|20|25|30|40|50|60|70|80|90|95)/ },
    { pattern: /text-(primary|emerald|amber|red|blue|purple|accent)-(50|100|200|300|400|500|600|700|800|900)\/(5|10|15|20|25|30|40|50|60|70|80|90|95)/ },
    { pattern: /border-(primary|emerald|amber|red|blue|purple|accent)-(50|100|200|300|400|500|600|700|800|900)\/(5|10|15|20|25|30|40|50|60|70|80|90|95)/ },
    { pattern: /ring-(primary|emerald|amber|red|blue|purple|accent)-(50|100|200|300|400|500|600|700|800|900)\/(5|10|15|20|25|30|40|50|60|70|80|90|95)/ },
    // Gradient utilities
    'bg-gradient-to-r',
    'from-primary-600',
    'via-primary-500',
    'to-accent-500',
    'from-primary-500/10',
    'to-primary-400/10',
    'from-emerald-500/10',
    'to-emerald-400/10',
    'from-blue-500/10',
    'to-blue-400/10',
    'from-red-500/10',
    'to-red-400/10',
    'from-amber-500/10',
    'to-amber-400/10',
    'from-purple-500/10',
    'to-purple-400/10',
  ],
}
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
        // Royal Elegance Theme (Default)
        royal: {
          primary: '#2D1B69',
          'primary-light': '#4A2F8F',
          'primary-dark': '#1A0F3E',
          gold: '#D4AF37',
          'gold-light': '#E8C547',
          'gold-dark': '#B8941F',
          rose: '#E91E63',
          teal: '#00BCD4',
          bg: '#FAFBFC',
          surface: '#FFFFFF',
          text: '#1A1A2E',
          'text-secondary': '#6B7280',
          border: '#E5E7EB',
        },
        
        // Dark Luxury Theme
        dark: {
          primary: '#0F172A',
          'primary-light': '#1E293B',
          'primary-dark': '#020617',
          accent: '#8B5CF6',
          'accent-light': '#A78BFA',
          gold: '#FCD34D',
          cyan: '#06B6D4',
          pink: '#EC4899',
          bg: '#0F172A',
          surface: '#1E293B',
          'surface-elevated': '#334155',
          text: '#F8FAFC',
          'text-secondary': '#94A3B8',
          border: '#334155',
        },
        
        // Neon Future Theme
        neon: {
          primary: '#7C3AED',
          'primary-light': '#A78BFA',
          'primary-dark': '#5B21B6',
          cyan: '#06B6D4',
          pink: '#EC4899',
          green: '#10B981',
          yellow: '#FBBF24',
          orange: '#F97316',
          bg: '#0A0A0F',
          surface: '#18181B',
          text: '#FAFAFA',
          'text-secondary': '#A1A1AA',
          border: '#27272A',
        },
        
        // Soft Pastel Theme
        pastel: {
          primary: '#A78BFA',
          'primary-light': '#C4B5FD',
          'primary-dark': '#8B5CF6',
          peach: '#FBBF24',
          mint: '#6EE7B7',
          rose: '#FDA4AF',
          blue: '#93C5FD',
          lavender: '#DDD6FE',
          bg: '#FEFCE8',
          surface: '#FFFFFF',
          text: '#374151',
          'text-secondary': '#9CA3AF',
          border: '#E5E7EB',
        },
        
        // Matte Gold Theme
        gold: {
          primary: '#92400E',
          'primary-light': '#B45309',
          'primary-dark': '#78350F',
          accent: '#D97706',
          'accent-light': '#F59E0B',
          champagne: '#FDE68A',
          emerald: '#059669',
          ruby: '#DC2626',
          bg: '#FFFBEB',
          surface: '#FFFFFF',
          text: '#1C1917',
          'text-secondary': '#78716C',
          border: '#E7E5E4',
        },
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
        heading: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        body: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      
      fontSize: {
        // Display sizes
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        
        // Headings
        'h1': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(45, 27, 105, 0.2)',
        'luxury-lg': '0 20px 60px -15px rgba(45, 27, 105, 0.3)',
        'luxury-xl': '0 30px 80px -20px rgba(45, 27, 105, 0.4)',
        'glow': '0 0 20px rgba(45, 27, 105, 0.3)',
        'glow-lg': '0 0 40px rgba(45, 27, 105, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'inner-luxury': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #2D1B69 0%, #4A2F8F 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E8C547 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #2D1B69 0%, #D4AF37 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'gradient-neon': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'gradient-pastel': 'linear-gradient(135deg, #A78BFA 0%, #FDA4AF 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

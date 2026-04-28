import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#0a0a0c',
        surface: {
          DEFAULT: '#131315',
          dim: '#0e0e10',
          low: '#1c1b1d',
          container: '#201f21',
          high: '#2a2a2c',
          highest: '#353437',
        },
        violet: {
          DEFAULT: '#7c3aed',
          light: '#d2bbff',
          dark: '#5a00c6',
          dim: '#3f008e',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          light: '#4cd7f6',
          dark: '#003640',
        },
        'on-surface': '#e5e1e4',
        'on-surface-variant': '#ccc3d8',
        outline: {
          DEFAULT: '#958da1',
          variant: '#4a4455',
        },
      },
      fontFamily: {
        epilogue: ['var(--font-epilogue)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '600' }],
        headline: ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'label-bold': ['14px', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      borderRadius: {
        card: '1.5rem',
        panel: '2rem',
        pill: '9999px',
      },
      spacing: {
        section: '7.5rem',
        outer: '4rem',
        18: '4.5rem',
        22: '5.5rem',
      },
      backdropBlur: {
        glass: '20px',
        'glass-lg': '40px',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marqueeReverse 35s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-violet-cyan': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        'gradient-violet-cyan-text': 'linear-gradient(135deg, #d2bbff 0%, #4cd7f6 100%)',
      },
      boxShadow: {
        'glow-violet': '0 0 80px -10px rgba(124,58,237,0.5)',
        'glow-cyan': '0 0 80px -10px rgba(6,182,212,0.4)',
        'glow-violet-sm': '0 0 40px -8px rgba(124,58,237,0.4)',
        'glow-cyan-sm': '0 0 40px -8px rgba(6,182,212,0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config

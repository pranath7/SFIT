/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#050d1a',
          dark: '#0a1628',
          card: '#0f1e35',
          mid: '#162a4a',
        },
        accent: {
          blue: '#1a6fff',
          electric: '#4d9fff',
          glow: 'rgba(26, 111, 255, 0.15)',
        },
        steel: '#8fa3c0',
        mist: '#e8f0fe',
        gold: '#c9a84c',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'border-trace': 'borderTrace 1.5s ease-in-out forwards',
        'progress-line': 'progressLine 1.5s ease-in-out forwards',
        'letter-reveal': 'letterReveal 0.4s ease-out forwards',
        'cursor-scale': 'cursorScale 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(37, 211, 102, 0.4), 0 0 20px rgba(37, 211, 102, 0.2)' },
          '50%': { boxShadow: '0 0 10px rgba(37, 211, 102, 0.6), 0 0 40px rgba(37, 211, 102, 0.3)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.96)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        borderTrace: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        progressLine: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        letterReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cursorScale: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.5)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #0a1628 0%, #1a6fff 100%)',
        'gradient-card': 'linear-gradient(180deg, #0f1e35 0%, #0a1628 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(26, 111, 255, 0.3), 0 0 60px rgba(26, 111, 255, 0.1)',
        'glow-blue-lg': '0 0 30px rgba(26, 111, 255, 0.4), 0 0 80px rgba(26, 111, 255, 0.15)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(26, 111, 255, 0.15)',
      },
    },
  },
  plugins: [],
};

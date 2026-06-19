/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1e293b', // slate-800
        slate: {
          light: '#f8fafc',  // slate-50
          body: '#64748b',   // slate-500
          border: '#e2e8f0', // slate-200
        },
        primary: '#1b3b6f',  // royal blue
        whatsapp: '#25D366',
        accent: {
          blue: '#475569',
          electric: '#8da9c4',
          glow: 'rgba(27, 59, 111, 0.15)',
        },
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'], // Slate uses clean sans-serif for headings mostly
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
        'gradient-cta': 'linear-gradient(135deg, #050d1a 0%, #0b192e 100%)',
        'gradient-card': 'linear-gradient(180deg, #0b192e 0%, #050d1a 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(205, 162, 116, 0.15), 0 0 60px rgba(205, 162, 116, 0.05)',
        'glow-blue-lg': '0 0 30px rgba(205, 162, 116, 0.2), 0 0 80px rgba(205, 162, 116, 0.08)',
        'card-hover': '0 8px 32px rgba(41, 47, 54, 0.04), 0 0 20px rgba(205, 162, 116, 0.08)',
      },
    },
  },
  plugins: [],
};

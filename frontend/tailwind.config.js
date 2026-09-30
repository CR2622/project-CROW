export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crow: {
          bg: '#121212',
          card: '#1E222B',
          border: '#30363D',
          blue: '#4285F4',
          yellow: '#FBBC05',
          red: '#EA4335',
          green: '#34A853',
        },
      },
      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'glow-yellow': 'glowYellow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 5px #EA4335, 0 0 10px #EA4335' },
          '50%': { boxShadow: '0 0 20px #EA4335, 0 0 40px #EA4335' },
        },
        glowYellow: {
          '0%, 100%': { boxShadow: '0 0 5px #FBBC05, 0 0 10px #FBBC05' },
          '50%': { boxShadow: '0 0 20px #FBBC05, 0 0 40px #FBBC05' },
        },
      },
    },
  },
  plugins: [],
}
